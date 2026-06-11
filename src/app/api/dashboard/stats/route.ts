import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET /api/dashboard/stats — Dashboard overview statistics
export async function GET() {
  try {
    // Total articles
    const [totalResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM articles'
    );

    // Published articles
    const [publishedResult] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM articles WHERE status = 'Published'"
    );

    // Draft articles
    const [draftResult] = await pool.query<RowDataPacket[]>(
      "SELECT COUNT(*) as total FROM articles WHERE status = 'Draft'"
    );

    // Total views
    const [viewsResult] = await pool.query<RowDataPacket[]>(
      'SELECT COALESCE(SUM(views), 0) as total FROM articles'
    );

    // Total categories
    const [catResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM categories'
    );

    // Total media
    const [mediaResult] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as total FROM media'
    );

    // Recent articles (last 5)
    const [recentArticles] = await pool.query<RowDataPacket[]>(
      `SELECT a.id, a.slug, a.title, a.status, a.views, a.created_at,
              c.name as category_name, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       ORDER BY a.created_at DESC LIMIT 5`
    );

    // Category breakdown with article counts
    const [categoryBreakdown] = await pool.query<RowDataPacket[]>(
      `SELECT c.id, c.name, c.slug, c.color, COUNT(a.id) as article_count
       FROM categories c
       LEFT JOIN articles a ON c.id = a.category_id
       GROUP BY c.id
       ORDER BY article_count DESC`
    );

    return NextResponse.json({
      stats: {
        totalArticles: totalResult[0].total,
        published: publishedResult[0].total,
        drafts: draftResult[0].total,
        totalViews: viewsResult[0].total,
        totalCategories: catResult[0].total,
        totalMedia: mediaResult[0].total,
      },
      recentArticles,
      categoryBreakdown,
    });
  } catch (error) {
    console.error('GET /api/dashboard/stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
