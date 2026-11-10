import mysql from 'mysql2/promise';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
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

async function applyWatermark(imageBuffer) {
  const logoPath = path.join(process.cwd(), 'public', 'logo.png');
  if (!fs.existsSync(logoPath)) {
    throw new Error('Logo not found: ' + logoPath);
  }

  const baseImageInstance = sharp(imageBuffer).rotate();
  const baseMeta = await baseImageInstance.metadata();

  const imgWidth = baseMeta.width;
  const imgHeight = baseMeta.height;
  if (!imgWidth || !imgHeight) throw new Error('Invalid dimensions');

  const trimmedLogoBuffer = await sharp(logoPath).trim().toBuffer();
  const trimmedMeta = await sharp(trimmedLogoBuffer).metadata();
  const logoAspect = (trimmedMeta.width || 1224) / (trimmedMeta.height || 761);

  let wmWidth = Math.round(imgWidth * 0.14);
  wmWidth = Math.max(55, Math.min(220, wmWidth));
  if (wmWidth > imgWidth * 0.28) {
    wmWidth = Math.round(imgWidth * 0.28);
  }

  const estimatedHeight = Math.round(wmWidth / logoAspect);
  if (estimatedHeight > imgHeight * 0.25) {
    wmWidth = Math.round(imgHeight * 0.25 * logoAspect);
  }

  const logoSharp = sharp(trimmedLogoBuffer).resize({
    width: wmWidth,
    fit: 'inside',
  });

  const alphaValue = 255;
  const logoWithOpacity = await logoSharp
    .ensureAlpha()
    .composite([
      {
        input: Buffer.from([255, 255, 255, alphaValue]),
        raw: { width: 1, height: 1, channels: 4 },
        tile: true,
        blend: 'dest-in',
      },
    ])
    .toBuffer();

  const logoMeta = await sharp(logoWithOpacity).metadata();
  const actualLogoWidth = logoMeta.width || wmWidth;
  const actualLogoHeight = logoMeta.height || Math.round(wmWidth / logoAspect);

  const padding = Math.max(14, Math.round(Math.min(imgWidth, imgHeight) * 0.035));
  const left = Math.max(0, imgWidth - actualLogoWidth - padding);
  const top = padding;

  const watermarkedBuffer = await baseImageInstance
    .composite([{ input: logoWithOpacity, left, top }])
    .toBuffer();

  const finalMeta = await sharp(watermarkedBuffer).metadata();
  const format = finalMeta.format || baseMeta.format || 'jpeg';
  const mimeType = format === 'jpeg' ? 'image/jpeg' : `image/${format}`;

  return { buffer: watermarkedBuffer, mimeType };
}

async function main() {
  const args = process.argv.slice(2);
  const limitArg = args.find(a => a.startsWith('--limit='));
  const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : 10;
  const idArg = args.find(a => a.startsWith('--id='));
  const specificId = idArg ? parseInt(idArg.split('=')[1], 10) : null;

  console.log('🔍 Finding images to watermark...');

  let query = "SELECT id, name, file_path FROM media WHERE type = 'image' AND file_path NOT IN (SELECT image_url FROM advertisements WHERE image_url IS NOT NULL)";
  const queryParams = [];
  if (specificId) {
    query += ' AND id = ?';
    queryParams.push(specificId);
  } else {
    query += ` ORDER BY id DESC LIMIT ${limit}`;
  }

  const [images] = await pool.query(query, queryParams);
  console.log(`Found ${images.length} images to process.\n`);

  for (let i = 0; i < images.length; i++) {
    const item = images[i];
    console.log(`[${i + 1}/${images.length}] Processing #${item.id}: ${item.name}...`);
    try {
      const res = await fetch(item.file_path);
      if (!res.ok) {
        console.warn(`  ⚠️ Failed to download: HTTP ${res.status}`);
        continue;
      }
      const rawBuf = Buffer.from(await res.arrayBuffer());
      const { buffer, mimeType } = await applyWatermark(rawBuf);

      const url = new URL(item.file_path);
      const s3Key = decodeURIComponent(url.pathname.substring(1));

      await s3.send(
        new PutObjectCommand({
          Bucket: S3_BUCKET_NAME.trim(),
          Key: s3Key,
          Body: buffer,
          ContentType: mimeType,
          ACL: 'public-read',
        })
      );

      const sizeBytes = buffer.length;
      const sizeStr =
        sizeBytes > 1024 * 1024
          ? (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB'
          : (sizeBytes / 1024).toFixed(0) + ' KB';

      await pool.query('UPDATE media SET size = ? WHERE id = ?', [sizeStr, item.id]);
      console.log(`  ✓ Successfully watermarked and re-uploaded (${sizeStr})`);
    } catch (err) {
      console.error(`  ❌ Error processing #${item.id}:`, err.message);
    }
  }

  console.log('\n🎉 Finished watermarking images.');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});

