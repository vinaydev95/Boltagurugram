import { config } from 'dotenv';
import mysql from 'mysql2/promise';
import sharp from 'sharp';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';

config({ path: '.env.local' });

const {
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  DB_PORT,
  AWS_REGION = 'eu-north-1',
  S3_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
} = process.env;

if (!S3_BUCKET_NAME || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
  console.error('❌ Missing AWS credentials in .env.local');
  process.exit(1);
}

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: Number(DB_PORT) || 3306,
});

const logoPath = path.join(process.cwd(), 'public', 'logo.png');

async function processImage(imageBuffer) {
  const trimmedLogo = await sharp(logoPath).trim().toBuffer();
  const logoMeta = await sharp(trimmedLogo).metadata();
  const logoAspect = logoMeta.width / logoMeta.height;

  const instance = sharp(imageBuffer).rotate();
  const meta = await instance.metadata();
  const imgWidth = meta.width;
  const imgHeight = meta.height;

  // 1. Detect if image has bottom-right watermark
  const cropW = Math.round(imgWidth * 0.28);
  const cropH = Math.round(imgHeight * 0.28);
  const bottomCornerRaw = await sharp(imageBuffer)
    .extract({
      left: imgWidth - cropW,
      top: imgHeight - cropH,
      width: cropW,
      height: cropH,
    })
    .raw()
    .toBuffer();

  let yellowCount = 0;
  for (let j = 0; j < bottomCornerRaw.length; j += 3) {
    const r = bottomCornerRaw[j], g = bottomCornerRaw[j + 1], b = bottomCornerRaw[j + 2];
    if (r > 200 && g > 160 && b < 60) yellowCount++;
  }

  const hasBottomWatermark = yellowCount > 80;

  let baseSharpInstance;

  if (hasBottomWatermark) {
    // 2. Inpaint bottom-right watermark
    let oldWmWidth = Math.round(imgWidth * 0.22);
    oldWmWidth = Math.max(70, Math.min(380, oldWmWidth));
    const oldWmHeight = Math.round(oldWmWidth / logoAspect);
    const oldPadding = Math.max(10, Math.round(Math.min(imgWidth, imgHeight) * 0.025));
    const oldLeft = imgWidth - oldWmWidth - oldPadding;
    const oldTop = imgHeight - oldWmHeight - oldPadding;

    const resizedOldLogo = await sharp(trimmedLogo)
      .resize(oldWmWidth, oldWmHeight)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const rawObj = await instance.raw().toBuffer({ resolveWithObject: true });
    const { data, info } = rawObj;
    const { data: logoData } = resizedOldLogo;

    const mask = new Uint8Array(oldWmWidth * oldWmHeight);
    for (let ly = 0; ly < oldWmHeight; ly++) {
      for (let lx = 0; lx < oldWmWidth; lx++) {
        if (logoData[(ly * oldWmWidth + lx) * 4 + 3] > 8) {
          mask[ly * oldWmWidth + lx] = 1;
        }
      }
    }

    // Dilate mask by 3px
    const dilated = new Uint8Array(oldWmWidth * oldWmHeight);
    for (let ly = 0; ly < oldWmHeight; ly++) {
      for (let lx = 0; lx < oldWmWidth; lx++) {
        if (mask[ly * oldWmWidth + lx]) {
          for (let dy = -3; dy <= 3; dy++) {
            for (let dx = -3; dx <= 3; dx++) {
              const ny = ly + dy, nx = lx + dx;
              if (ny >= 0 && ny < oldWmHeight && nx >= 0 && nx < oldWmWidth) {
                dilated[ny * oldWmWidth + nx] = 1;
              }
            }
          }
        }
      }
    }

    for (let ly = 0; ly < oldWmHeight; ly++) {
      const y = oldTop + ly;
      if (y >= info.height) continue;

      for (let lx = 0; lx < oldWmWidth; lx++) {
        if (dilated[ly * oldWmWidth + lx]) {
          const x = oldLeft + lx;
          if (x >= info.width) continue;

          let leftColor = null, leftDist = 0;
          for (let step = 1; step < 120; step++) {
            const checkX = lx - step;
            if (checkX < 0 || !dilated[ly * oldWmWidth + checkX]) {
              const sx = Math.max(0, oldLeft + checkX);
              const idx = (y * info.width + sx) * info.channels;
              leftColor = [data[idx], data[idx + 1], data[idx + 2]];
              leftDist = step;
              break;
            }
          }

          let rightColor = null, rightDist = 0;
          for (let step = 1; step < 120; step++) {
            const checkX = lx + step;
            if (checkX >= oldWmWidth || !dilated[ly * oldWmWidth + checkX]) {
              const sx = Math.min(info.width - 1, oldLeft + checkX);
              const idx = (y * info.width + sx) * info.channels;
              rightColor = [data[idx], data[idx + 1], data[idx + 2]];
              rightDist = step;
              break;
            }
          }

          let topColor = null, topDist = 0;
          for (let step = 1; step < 120; step++) {
            const checkY = ly - step;
            if (checkY < 0 || !dilated[checkY * oldWmWidth + lx]) {
              const sy = Math.max(0, oldTop + checkY);
              const idx = (sy * info.width + x) * info.channels;
              topColor = [data[idx], data[idx + 1], data[idx + 2]];
              topDist = step;
              break;
            }
          }

          let bottomColor = null, bottomDist = 0;
          for (let step = 1; step < 120; step++) {
            const checkY = ly + step;
            if (checkY >= oldWmHeight || !dilated[checkY * oldWmWidth + lx]) {
              const sy = Math.min(info.height - 1, oldTop + checkY);
              const idx = (sy * info.width + x) * info.channels;
              bottomColor = [data[idx], data[idx + 1], data[idx + 2]];
              bottomDist = step;
              break;
            }
          }

          let totalWeight = 0;
          let rSum = 0, gSum = 0, bSum = 0;
          if (leftColor) {
            const w = 1 / (leftDist * leftDist);
            totalWeight += w;
            rSum += leftColor[0] * w; gSum += leftColor[1] * w; bSum += leftColor[2] * w;
          }
          if (rightColor) {
            const w = 1 / (rightDist * rightDist);
            totalWeight += w;
            rSum += rightColor[0] * w; gSum += rightColor[1] * w; bSum += rightColor[2] * w;
          }
          if (topColor) {
            const w = 1.2 / (topDist * topDist);
            totalWeight += w;
            rSum += topColor[0] * w; gSum += topColor[1] * w; bSum += topColor[2] * w;
          }
          if (bottomColor) {
            const w = 1.2 / (bottomDist * bottomDist);
            totalWeight += w;
            rSum += bottomColor[0] * w; gSum += bottomColor[1] * w; bSum += bottomColor[2] * w;
          }

          const idx = (y * info.width + x) * info.channels;
          data[idx] = Math.round(rSum / totalWeight);
          data[idx + 1] = Math.round(gSum / totalWeight);
          data[idx + 2] = Math.round(bSum / totalWeight);
        }
      }
    }

    baseSharpInstance = sharp(data, {
      raw: { width: info.width, height: info.height, channels: info.channels }
    });
  } else {
    baseSharpInstance = sharp(imageBuffer).rotate();
  }

  // 3. Composite NEW SMALL & COMPLETE WATERMARK AT TOP-RIGHT
  let newWmWidth = Math.round(imgWidth * 0.14);
  newWmWidth = Math.max(55, Math.min(220, newWmWidth));
  if (newWmWidth > imgWidth * 0.28) {
    newWmWidth = Math.round(imgWidth * 0.28);
  }

  const newPadding = Math.max(14, Math.round(Math.min(imgWidth, imgHeight) * 0.035));
  const newLeft = Math.max(0, imgWidth - newWmWidth - newPadding);
  const newTop = newPadding;

  const logoSharp = sharp(trimmedLogo).resize({ width: newWmWidth, fit: 'inside' });
  const processedLogo = await logoSharp.toBuffer();

  const finalBuf = await baseSharpInstance
    .composite([{ input: processedLogo, left: newLeft, top: newTop }])
    .jpeg({ quality: 92 })
    .toBuffer();

  return { buffer: finalBuf, hadBottomWatermark: hasBottomWatermark };
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : null;

  console.log('🚀 Starting watermark migration to small top-right...');
  if (dryRun) console.log('⚠️ DRY RUN MODE: No files will be uploaded or DB updated.\n');

  // Query articles with images, excluding ads
  let query = `
    SELECT id, title, image_url 
    FROM articles 
    WHERE image_url IS NOT NULL 
      AND id >= 550
      AND image_url NOT IN (SELECT image_url FROM advertisements WHERE image_url IS NOT NULL)
    ORDER BY id DESC
  `;
  if (limit) {
    query += ` LIMIT ${limit}`;
  }

  const [articles] = await pool.query(query);
  console.log(`Found ${articles.length} recent articles to examine.\n`);

  let modifiedCount = 0;

  for (let i = 0; i < articles.length; i++) {
    const art = articles[i];
    process.stdout.write(`[${i + 1}/${articles.length}] #${art.id}: "${art.title.slice(0, 30)}"... `);

    try {
      const res = await fetch(art.image_url);
      if (!res.ok) {
        console.log(`⚠️ Fetch failed (${res.status})`);
        continue;
      }
      const rawBuf = Buffer.from(await res.arrayBuffer());
      const { buffer, hadBottomWatermark } = await processImage(rawBuf);

      if (!hadBottomWatermark) {
        console.log('✓ No bottom watermark, skipping.');
        continue;
      }

      modifiedCount++;

      if (dryRun) {
        console.log(`[DRY RUN] Would update image (${(buffer.length / 1024).toFixed(0)} KB)`);
        continue;
      }

      // Upload to S3
      const timestamp = Date.now();
      const oldUrl = new URL(art.image_url);
      const baseKey = path.basename(oldUrl.pathname, path.extname(oldUrl.pathname));
      const s3Key = `news-portal/${baseKey}-top-${timestamp}.jpg`;

      await s3.send(new PutObjectCommand({
        Bucket: S3_BUCKET_NAME.trim(),
        Key: s3Key,
        Body: buffer,
        ContentType: 'image/jpeg',
        ACL: 'public-read',
      }));

      const newUrl = `https://${S3_BUCKET_NAME.trim()}.s3.${AWS_REGION}.amazonaws.com/${s3Key}`;

      // Update articles table
      await pool.query('UPDATE articles SET image_url = ? WHERE id = ?', [newUrl, art.id]);

      // Update media table if this file_path was recorded
      await pool.query('UPDATE media SET file_path = ? WHERE file_path = ?', [newUrl, art.image_url]);

      console.log(`✓ Cleaned & moved to top!`);
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    }
  }

  console.log(`\n🎉 Done! Processed ${articles.length} articles, updated ${modifiedCount} with small top-right watermark.`);
  await pool.end();
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

