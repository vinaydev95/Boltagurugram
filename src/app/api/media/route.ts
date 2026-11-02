import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { applyWatermark, WatermarkOptions } from '@/lib/watermark';

// GET /api/media — Fetch all media files
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM media ORDER BY created_at DESC'
    );

    return NextResponse.json({ media: rows });
  } catch (error) {
    console.error('GET /api/media error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

// POST /api/media — Upload file to S3 and save record
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read file as buffer
    const bytes = await file.arrayBuffer();
    let buffer: Buffer = Buffer.from(bytes) as unknown as Buffer;
    let contentType = file.type;

    // Check if watermark is requested (default: true for raster images)
    const watermarkParam = formData.get('watermark');
    const shouldWatermark = watermarkParam === null || watermarkParam === undefined || watermarkParam === 'true' || watermarkParam === '1';
    const watermarkPosition = (formData.get('watermarkPosition') as WatermarkOptions['position']) || 'bottom-right';

    const isRasterImage = file.type.startsWith('image/') && !file.type.includes('svg') && !file.type.includes('gif');

    if (shouldWatermark && isRasterImage) {
      try {
        const watermarked = await applyWatermark(buffer, { position: watermarkPosition });
        buffer = watermarked.buffer;
        contentType = watermarked.mimeType;
      } catch (wmErr) {
        console.warn('Failed to apply watermark, proceeding with original file:', wmErr);
      }
    }

    // Generate unique filename
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const fileName = `${timestamp}-${safeName}`;
    const s3Key = `${process.env.S3_FOLDER_PREFIX || 'news-portal'}/${fileName}`;

    // Upload to S3 using fetch (no SDK needed)
    const region = process.env.AWS_REGION || 'eu-north-1';
    const bucket = process.env.S3_BUCKET_NAME?.trim();
    const accessKey = process.env.AWS_ACCESS_KEY_ID;
    const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!bucket || !accessKey || !secretKey) {
      return NextResponse.json({ error: 'S3 configuration missing' }, { status: 500 });
    }

    // Use AWS SDK v3 style signing
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

    const s3 = new S3Client({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
    }));

    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;

    // Format file size
    const sizeBytes = buffer.length;
    let sizeStr: string;
    if (sizeBytes > 1024 * 1024) {
      sizeStr = (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB';
    } else {
      sizeStr = (sizeBytes / 1024).toFixed(0) + ' KB';
    }

    // Save to database
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO media (name, file_path, size, type) VALUES (?, ?, ?, ?)',
      [file.name, fileUrl, sizeStr, file.type.startsWith('image') ? 'image' : 'file']
    );

    const [newMedia] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM media WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({ success: true, media: newMedia[0] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/media error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
