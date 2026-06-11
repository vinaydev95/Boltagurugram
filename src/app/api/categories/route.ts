import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const dynamic = 'force-dynamic';

// GET /api/categories — Fetch all categories with article counts
export async function GET() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(`
      SELECT c.*, COUNT(a.id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'Published'
      GROUP BY c.id
      ORDER BY c.name ASC
    `);

    return NextResponse.json({ categories: rows });
  } catch (error) {
    console.error('GET /api/categories error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST /api/categories — Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, color } = body;

    if (!name) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    // Check uniqueness
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM categories WHERE slug = ?',
      [slug]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: 'Category already exists' }, { status: 409 });
    }

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO categories (name, slug, color) VALUES (?, ?, ?)',
      [name, slug, color || '#6b7280']
    );

    const [newCat] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categories WHERE id = ?',
      [result.insertId]
    );

    return NextResponse.json({ success: true, category: newCat[0] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/categories error:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
