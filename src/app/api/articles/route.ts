import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET /api/articles — Fetch all articles (with optional filters)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'created_at';
    const order = searchParams.get('order') || 'DESC';

    let query = `
      SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE 1=1
    `;
    const params: (string | number | boolean)[] = [];

    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    if (featured === 'true') {
      query += ' AND a.featured = TRUE';
    }

    if (search) {
      query += ' AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.tags LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Validate sort column to prevent SQL injection
    const allowedSorts = ['created_at', 'views', 'title', 'updated_at'];
    const safeSort = allowedSorts.includes(sort) ? sort : 'created_at';
    const safeOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    query += ` ORDER BY a.${safeSort} ${safeOrder} LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await pool.query<RowDataPacket[]>(query, params);

    // Get total count for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.id
      WHERE 1=1
    `;
    const countParams: (string | number | boolean)[] = [];

    if (category) {
      countQuery += ' AND c.slug = ?';
      countParams.push(category);
    }
    if (status) {
      countQuery += ' AND a.status = ?';
      countParams.push(status);
    }
    if (featured === 'true') {
      countQuery += ' AND a.featured = TRUE';
    }
    if (search) {
      countQuery += ' AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.tags LIKE ?)';
      const searchTerm = `%${search}%`;
      countParams.push(searchTerm, searchTerm, searchTerm);
    }

    const [countResult] = await pool.query<RowDataPacket[]>(countQuery, countParams);
    const total = countResult[0].total;

    return NextResponse.json({
      articles: rows,
      pagination: { total, limit, offset, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error('GET /api/articles error:', error);
    return NextResponse.json({ error: 'Failed to fetch articles' }, { status: 500 });
  }
}

// POST /api/articles — Create a new article
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, excerpt, content, image_url, meta_title, meta_description, category_id, author, status, tags, featured, read_time } = body;

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Use meta_title if provided for the URL/slug, otherwise fall back to title
    const slugSource = meta_title && meta_title.trim().length > 0 ? meta_title : title;

    // Generate slug from slugSource - support Unicode letters/numbers/marks (e.g. Hindi)
    const rawSlug = slugSource
      .toLowerCase()
      .replace(new RegExp('[^\\p{L}\\p{N}\\p{M}\\s-]', 'gu'), '') // Support Unicode letters, numbers & marks
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')  // trim leading/trailing dashes
      .substring(0, 200);

    // If slug is empty or only dashes, use a timestamp slug
    const baseSlug = rawSlug && rawSlug.replace(/-/g, '').length > 0
      ? rawSlug
      : `article-${Date.now()}`;

    // Check slug uniqueness
    const [existing] = await pool.query<RowDataPacket[]>(
      'SELECT id FROM articles WHERE slug = ?',
      [baseSlug]
    );

    const finalSlug = existing.length > 0 ? `${baseSlug}-${Date.now()}` : baseSlug;

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO articles (slug, title, excerpt, content, image_url, meta_title, meta_description, category_id, author, status, tags, featured, read_time)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        finalSlug,
        title,
        excerpt || null,
        content || null,
        image_url || null,
        meta_title || null,
        meta_description || null,
        category_id || null,
        author || 'Admin',
        status || 'Draft',
        tags || null,
        featured || false,
        read_time || '3 min',
      ]
    );

    // Fetch the created article
    const [newArticle] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, c.name as category_name, c.slug as category_slug
       FROM articles a LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.id = ?`,
      [result.insertId]
    );

    return NextResponse.json({ success: true, article: newArticle[0] }, { status: 201 });
  } catch (error) {
    console.error('POST /api/articles error:', error);
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}
