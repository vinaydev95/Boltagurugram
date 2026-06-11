import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET /api/categories/[id] — Fetch single category
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
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category: rows[0] });
  } catch (error) {
    console.error('GET /api/categories/[id] error:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

// PUT /api/categories/[id] — Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }
    const body = await request.json();
    const { name, color } = body;

    const updates: string[] = [];
    const updateParams: (string | number)[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      updateParams.push(name);
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      updates.push('slug = ?');
      updateParams.push(slug);
    }

    if (color !== undefined) {
      updates.push('color = ?');
      updateParams.push(color);
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateParams.push(id);
    const [result] = await pool.query<ResultSetHeader>(
      `UPDATE categories SET ${updates.join(', ')} WHERE id = ?`,
      updateParams
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const [updated] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );

    return NextResponse.json({ success: true, category: updated[0] });
  } catch (error) {
    console.error('PUT /api/categories/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

// DELETE /api/categories/[id] — Delete category
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Set articles in this category to null
    await pool.query('UPDATE articles SET category_id = NULL WHERE category_id = ?', [id]);

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('DELETE /api/categories/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
