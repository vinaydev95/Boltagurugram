import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { applyWatermark, WatermarkOptions } from '@/lib/watermark';

// POST /api/media/[id]/watermark — Watermark an existing image in media library
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM media WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const media = rows[0];

    if (media.type !== 'image') {
      return NextResponse.json({ error: 'File is not an image' }, { status: 400 });
    }

    let position: WatermarkOptions['position'] = 'bottom-right';
    try {
      const body = await request.json().catch(() => ({}));
      if (body?.position) {
        position = body.position;
      }
    } catch {
      // ignore
    }

    // Fetch the existing image from S3 / file_path
    const imageRes = await fetch(media.file_path);
    if (!imageRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch existing image from storage' }, { status: 502 });
    }

    const arrayBuf = await imageRes.arrayBuffer();
    const inputBuf = Buffer.from(arrayBuf);

    // Apply watermark
    const watermarked = await applyWatermark(inputBuf, { position });
    const buffer = watermarked.buffer;
    const contentType = watermarked.mimeType;

    // S3 credentials
    const region = process.env.AWS_REGION || 'eu-north-1';
    const bucket = process.env.S3_BUCKET_NAME?.trim();
    const accessKey = process.env.AWS_ACCESS_KEY_ID;
    const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

    if (!bucket || !accessKey || !secretKey) {
      return NextResponse.json({ error: 'S3 configuration missing' }, { status: 500 });
    }

    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');

    const s3 = new S3Client({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });

    // Extract S3 key from existing file_path
    const url = new URL(media.file_path);
    const s3Key = decodeURIComponent(url.pathname.substring(1)); // Remove leading /

    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: s3Key,
      Body: buffer,
      ContentType: contentType,
      ACL: 'public-read',
    }));

    // Update size in database
    const sizeBytes = buffer.length;
    let sizeStr: string;
    if (sizeBytes > 1024 * 1024) {
      sizeStr = (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB';
    } else {
      sizeStr = (sizeBytes / 1024).toFixed(0) + ' KB';
    }

    await pool.query<ResultSetHeader>(
      'UPDATE media SET size = ? WHERE id = ?',
      [sizeStr, id]
    );

    const [updatedRows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM media WHERE id = ?',
      [id]
    );

    return NextResponse.json({ success: true, media: updatedRows[0] });
  } catch (error: any) {
    console.error('POST /api/media/[id]/watermark error:', error);
    return NextResponse.json({ error: error?.message || 'Failed to apply watermark' }, { status: 500 });
  }
}

