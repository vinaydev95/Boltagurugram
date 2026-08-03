import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position');
    const activeOnly = searchParams.get('activeOnly') === 'true';

    let query = 'SELECT * FROM advertisements';
    const params: any[] = [];
    const conditions: string[] = [];

    if (position) {
      conditions.push('position = ?');
      params.push(position);
    }
    if (activeOnly) {
      conditions.push('active = 1 AND (expires_at IS NULL OR expires_at > NOW())');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY id DESC';

    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    
    return NextResponse.json({ advertisements: rows });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    return NextResponse.json({ error: 'Failed to fetch advertisements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { title, position, image_url, target_url, active } = data;

    if (!title || !position || !image_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const isActive = active !== undefined ? active : true;
    const targetUrlSafe = target_url || '';
    
    // Convert empty string to null for database
    const expiresAt = data.expires_at ? new Date(data.expires_at) : null;

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO advertisements (title, position, image_url, target_url, active, expires_at) VALUES (?, ?, ?, ?, ?, ?)',
      [title, position, image_url, targetUrlSafe, isActive, expiresAt]
    );

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error creating advertisement:', error);
    return NextResponse.json({ error: 'Failed to create advertisement' }, { status: 500 });
  }
}
