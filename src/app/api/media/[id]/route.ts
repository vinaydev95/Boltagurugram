import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET /api/media/[id] — Fetch single media file record
export async function GET(
  _request: NextRequest,
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

    return NextResponse.json({ media: rows[0] });
  } catch (error) {
    console.error('GET /api/media/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 });
  }
}

// DELETE /api/media/[id] — Delete media file from S3 and DB
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Get the file info first
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM media WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    const media = rows[0];

    // Try to delete from S3
    try {
      const region = process.env.AWS_REGION || 'eu-north-1';
      const bucket = process.env.S3_BUCKET_NAME?.trim();
      const accessKey = process.env.AWS_ACCESS_KEY_ID;
      const secretKey = process.env.AWS_SECRET_ACCESS_KEY;

      if (bucket && accessKey && secretKey) {
        const { S3Client, DeleteObjectCommand } = await import('@aws-sdk/client-s3');

        const s3 = new S3Client({
          region,
          credentials: {
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
          },
        });

        // Extract S3 key from the full URL
        const url = new URL(media.file_path);
        const s3Key = url.pathname.substring(1); // Remove leading /

        await s3.send(new DeleteObjectCommand({
          Bucket: bucket,
          Key: s3Key,
        }));
      }
    } catch (s3Error) {
      console.error('S3 delete error (continuing with DB delete):', s3Error);
    }

    // Delete from database
    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM media WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Media deleted' });
  } catch (error) {
    console.error('DELETE /api/media/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 });
  }
}
