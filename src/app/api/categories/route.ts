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
      ORDER BY c.sort_order ASC, c.name ASC
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

    // Get max sort_order
    const [maxOrderRows] = await pool.query<RowDataPacket[]>(
      'SELECT MAX(sort_order) as max_order FROM categories'
    );
    const nextOrder = (maxOrderRows[0]?.max_order ?? -1) + 1;

    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO categories (name, slug, color, sort_order) VALUES (?, ?, ?, ?)',
      [name, slug, color || '#6b7280', nextOrder]
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

// PUT /api/categories — Reorder categories
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderedIds } = body;

    if (!orderedIds || !Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds array is required' }, { status: 400 });
    }

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      for (let i = 0; i < orderedIds.length; i++) {
        await connection.query(
          'UPDATE categories SET sort_order = ? WHERE id = ?',
          [i, orderedIds[i]]
        );
      }

      await connection.commit();
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }

    return NextResponse.json({ success: true, message: 'Categories reordered successfully' });
  } catch (error) {
    console.error('PUT /api/categories reorder error:', error);
    return NextResponse.json({ error: 'Failed to reorder categories' }, { status: 500 });
  }
}

