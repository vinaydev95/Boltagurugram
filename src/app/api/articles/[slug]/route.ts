import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET /api/articles/[slug] — Fetch single article by slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Increment views
    await pool.query('UPDATE articles SET views = views + 1 WHERE slug = ?', [slug]);

    // Fetch article with category info
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.slug = ?`,
      [slug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Fetch related articles (same category, exclude current)
    const article = rows[0];
    const [related] = await pool.query<RowDataPacket[]>(
      `SELECT a.slug, a.title, a.excerpt, a.views, a.read_time, a.created_at,
              c.name as category_name, c.slug as category_slug
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.category_id = ? AND a.slug != ? AND a.status = 'Published'
       ORDER BY a.created_at DESC LIMIT 4`,
      [article.category_id, slug]
    );

    return NextResponse.json({ article, related });
  } catch (error) {
    console.error('GET /api/articles/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

// PUT /api/articles/[slug] — Update article
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { title, excerpt, content, image_url, category_id, author, status, tags, featured, read_time } = body;

    // Check if article exists
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM articles WHERE slug = ?',
      [slug]
    );

    if (existing.length === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Build update query dynamically
    const updates: string[] = [];
    const updateParams: (string | number | boolean | null)[] = [];

    if (title !== undefined) {
      updates.push('title = ?');
      updateParams.push(title);
      // Update slug if title changes
      const newSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 200);
      updates.push('slug = ?');
      updateParams.push(newSlug);
    }
    if (excerpt !== undefined) { updates.push('excerpt = ?'); updateParams.push(excerpt); }
    if (content !== undefined) { updates.push('content = ?'); updateParams.push(content); }
    if (image_url !== undefined) { updates.push('image_url = ?'); updateParams.push(image_url); }
    if (category_id !== undefined) { updates.push('category_id = ?'); updateParams.push(category_id); }
    if (author !== undefined) { updates.push('author = ?'); updateParams.push(author); }
    if (status !== undefined) { updates.push('status = ?'); updateParams.push(status); }
    if (tags !== undefined) { updates.push('tags = ?'); updateParams.push(tags); }
    if (featured !== undefined) { updates.push('featured = ?'); updateParams.push(featured); }
    if (read_time !== undefined) { updates.push('read_time = ?'); updateParams.push(read_time); }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    updateParams.push(slug);
    await pool.query<ResultSetHeader>(
      `UPDATE articles SET ${updates.join(', ')} WHERE slug = ?`,
      updateParams
    );

    // Fetch updated article
    const [updated] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, c.name as category_name, c.slug as category_slug
       FROM articles a LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.id = ?`,
      [existing[0].id]
    );

    return NextResponse.json({ success: true, article: updated[0] });
  } catch (error) {
    console.error('PUT /api/articles/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

// DELETE /api/articles/[slug] — Delete article
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const [result] = await pool.query<ResultSetHeader>(
      'DELETE FROM articles WHERE slug = ?',
      [slug]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Article deleted' });
  } catch (error) {
    console.error('DELETE /api/articles/[slug] error:', error);
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}
