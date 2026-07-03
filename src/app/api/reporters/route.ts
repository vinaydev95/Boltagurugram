import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const dynamic = 'force-dynamic';

// GET /api/reporters — Fetch all reporters with their article counts
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT r.*, COUNT(a.id) as article_count
      FROM reporters r
      LEFT JOIN articles a ON r.name = a.author AND a.status = 'Published'
      GROUP BY r.id
      ORDER BY r.name ASC
    `);

    return NextResponse.json({ reporters: rows });
  } catch (error) {
    console.error('GET /api/reporters error:', error);
    return NextResponse.json({ error: 'Failed to fetch reporters' }, { status: 500 });
  }
}

// POST /api/reporters — Create a new reporter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, avatar_url, bio } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and Email are required' }, { status: 400 });
    }

    // Check uniqueness of email and name
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM reporters WHERE email = ? OR name = ?',
      [email, name]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Reporter name or email already exists' }, { status: 409 });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO reporters (name, email, password, role, avatar_url, bio) VALUES (?, ?, ?, ?, ?, ?)',
      [name, email, password || 'Reporter@2026', role || 'Reporter', avatar_url || null, bio || null]
    );

    const [newReporter] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM reporters WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({ success: true, reporter: newReporter[0] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/reporters error:', error);
    return NextResponse.json({ error: 'Failed to create reporter' }, { status: 500 });
  }
}
