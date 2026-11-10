import mysql from 'mysql2/promise';
import sharp from 'sharp';
import { config } from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

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
  console.error('❌ Missing AWS S3 configuration in .env.local');
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

async function removeWatermarkFromBuffer(imageBuffer) {
  const trimmedLogo = await sharp('public/logo.png').trim().toBuffer();
  const logoMeta = await sharp(trimmedLogo).metadata();
  const logoAspect = logoMeta.width / logoMeta.height;

  const instance = sharp(imageBuffer).rotate();
  const adMeta = await instance.metadata();

  let wmWidth = Math.round(adMeta.width * 0.22);
  wmWidth = Math.max(70, Math.min(380, wmWidth));
  const wmHeight = Math.round(wmWidth / logoAspect);
  const padding = Math.max(10, Math.round(Math.min(adMeta.width, adMeta.height) * 0.025));
  const left = adMeta.width - wmWidth - padding;
  const top = adMeta.height - wmHeight - padding;

  const resizedLogoRaw = await sharp(trimmedLogo)
    .resize(wmWidth, wmHeight)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const adRaw = await instance.raw().toBuffer({ resolveWithObject: true });
  const { data: adData, info: adInfo } = adRaw;
  const { data: logoData } = resizedLogoRaw;

  // Build mask from logo alpha > 5
  const mask = new Uint8Array(wmWidth * wmHeight);
  for (let ly = 0; ly < wmHeight; ly++) {
    for (let lx = 0; lx < wmWidth; lx++) {
      if (logoData[(ly * wmWidth + lx) * 4 + 3] > 5) {
        mask[ly * wmWidth + lx] = 1;
      }
    }
  }

  // Dilate by 4px to cover all borders, anti-aliasing, and drop shadows
  const dilated = new Uint8Array(wmWidth * wmHeight);
  for (let ly = 0; ly < wmHeight; ly++) {
    for (let lx = 0; lx < wmWidth; lx++) {
      if (mask[ly * wmWidth + lx]) {
        for (let dy = -4; dy <= 4; dy++) {
          for (let dx = -4; dx <= 4; dx++) {
            const ny = ly + dy, nx = lx + dx;
            if (ny >= 0 && ny < wmHeight && nx >= 0 && nx < wmWidth) {
              dilated[ny * wmWidth + nx] = 1;
            }
          }
        }
      }
    }
  }

  let cleanedCount = 0;
  for (let ly = 0; ly < wmHeight; ly++) {
    const y = top + ly;
    if (y >= adInfo.height) continue;
    // Sample clean background 15px to the left of the watermark box
    const refX = Math.max(0, left - 15);
    const refIdx = (y * adInfo.width + refX) * adInfo.channels;
    const r = adData[refIdx], g = adData[refIdx + 1], b = adData[refIdx + 2];

    for (let lx = 0; lx < wmWidth; lx++) {
      if (dilated[ly * wmWidth + lx]) {
        const x = left + lx;
        if (x >= adInfo.width) continue;
        const idx = (y * adInfo.width + x) * adInfo.channels;
        adData[idx] = r;
        adData[idx + 1] = g;
        adData[idx + 2] = b;
        cleanedCount++;
      }
    }
  }

  const cleanBuffer = await sharp(adData, { raw: adInfo })
    .jpeg({ quality: 95 })
    .toBuffer();

  return { buffer: cleanBuffer, cleaned: cleanedCount > 0, cleanedCount };
}

async function main() {
  console.log('🔍 Fetching all active advertisement images from database...');
  const [ads] = await pool.query('SELECT id, title, image_url FROM advertisements WHERE image_url IS NOT NULL ORDER BY id ASC');

  console.log(`Found ${ads.length} advertisements to inspect.\n`);

  for (let i = 0; i < ads.length; i++) {
    const ad = ads[i];
    console.log(`[${i + 1}/${ads.length}] Checking Ad #${ad.id}: "${ad.title.trim()}"...`);

    try {
      const res = await fetch(ad.image_url);
      if (!res.ok) {
        console.warn(`  ⚠️ Failed to fetch image (HTTP ${res.status}): ${ad.image_url}`);
        continue;
      }

      const rawBuffer = Buffer.from(await res.arrayBuffer());
      const { buffer: cleanBuffer, cleaned, cleanedCount } = await removeWatermarkFromBuffer(rawBuffer);

      if (!cleaned) {
        console.log(`  ✓ No watermark found, skipping.`);
        continue;
      }

      console.log(`  🔄 Removed ${cleanedCount} watermark pixels using master logo mask!`);

      const url = new URL(ad.image_url);
      const originalKey = decodeURIComponent(url.pathname.substring(1));

      // 1. Overwrite original S3 object
      await s3.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET_NAME.trim(),
          Key: originalKey,
          Body: cleanBuffer,
          ContentType: 'image/jpeg',
          ACL: 'public-read',
        })
      );

      // 2. Upload to fresh clean key with timestamp to completely bust all browser and CDN caches
      const cleanKey = originalKey.replace(/\.([^.]+)$/, `-clean-${Date.now()}.$1`);
      await s3.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET_NAME.trim(),
          Key: cleanKey,
          Body: cleanBuffer,
          ContentType: 'image/jpeg',
          ACL: 'public-read',
        })
      );

      const newImageUrl = `https://${S3_BUCKET_NAME.trim()}.s3.${AWS_REGION}.amazonaws.com/${cleanKey}`;

      // 3. Update database with fresh cache-busted URL so browser loads clean version immediately
      await pool.query('UPDATE advertisements SET image_url = ? WHERE id = ?', [newImageUrl, ad.id]);

      // 4. Update media table record
      const sizeBytes = cleanBuffer.length;
      const sizeStr =
        sizeBytes > 1024 * 1024
          ? (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB'
          : (sizeBytes / 1024).toFixed(0) + ' KB';

      await pool.query('UPDATE media SET file_path = ?, size = ? WHERE file_path = ?', [newImageUrl, sizeStr, ad.image_url]);

      console.log(`  ✅ Successfully updated Ad #${ad.id} with clean URL: ${newImageUrl}`);
    } catch (err) {
      console.error(`  ❌ Error processing Ad #${ad.id}:`, err.message);
    }
  }

  console.log('\n🎉 Finished removing watermarks from all advertisements!');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
