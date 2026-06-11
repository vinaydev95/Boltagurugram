import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    // Add image_url column if it doesn't exist
    await pool.query('ALTER TABLE articles ADD COLUMN image_url VARCHAR(500) NULL AFTER content');
    return NextResponse.json({ success: true, message: 'Database migrated successfully' });
  } catch (error: any) {
    // Ignore duplicate column error
    if (error.code === 'ER_DUP_FIELDNAME') {
      return NextResponse.json({ success: true, message: 'Column already exists' });
    }
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
