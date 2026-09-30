import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// ============================================
// SERVER-SIDE DATA FUNCTIONS
// These fetch directly from MySQL for server components
// ============================================

export interface DBArticle {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image_url: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  category_id: number;
  category_name: string;
  category_slug: string;
  category_color: string;
  author: string;
  status: string;
  tags: string;
  featured: boolean;
  views: number;
  read_time: string;
  created_at: string;
  updated_at: string;
}

export interface DBCategory {
  id: number;
  name: string;
  slug: string;
  color: string;
  article_count: number;
  created_at: string;
}

// Format date to readable string
function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format views to readable string (e.g., 45200 -> "45.2K")
function formatViews(views: number): string {
  if (views >= 1000) {
    return (views / 1000).toFixed(1) + 'K';
  }
  return String(views);
}

// Normalize article row from DB for frontend
function normalizeArticle(row: any) {
  return {
    ...row,
    date: formatDate(row.created_at),
    viewsFormatted: formatViews(row.views || 0),
    tagsArray: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
  };
}

// ------- ARTICLE QUERIES -------

export async function getLatestArticlesDB(count: number = 14) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.status = 'Published'
       ORDER BY a.created_at DESC
       LIMIT ?`,
      [count]
    );
    return rows.map(normalizeArticle);
  } catch (error) {
    console.error('getLatestArticlesDB error:', error);
    return [];
  }
}

export async function getTrendingArticlesDB(count: number = 5) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.status = 'Published'
       ORDER BY a.views DESC
       LIMIT ?`,
      [count]
    );
    return rows.map(normalizeArticle);
  } catch (error) {
    console.error('getTrendingArticlesDB error:', error);
    return [];
  }
}

export async function getArticlesByCategoryDB(categorySlug: string, count: number = 10) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, c_primary.name as category_name, c_primary.slug as category_slug, c_primary.color as category_color
       FROM articles a
       JOIN article_categories ac ON a.id = ac.article_id
       JOIN categories c_search ON ac.category_id = c_search.id
       LEFT JOIN categories c_primary ON a.category_id = c_primary.id
       WHERE c_search.slug = ? AND a.status = 'Published'
       ORDER BY a.created_at DESC
       LIMIT ?`,
      [categorySlug, count]
    );
    return rows.map(normalizeArticle);
  } catch (error) {
    console.error('getArticlesByCategoryDB error:', error);
    return [];
  }
}

export async function incrementArticleViewsDB(slug: string) {
  try {
    await pool.query('UPDATE articles SET views = views + 1 WHERE slug = ?', [slug]);
  } catch (error) {
    console.error('incrementArticleViewsDB error:', error);
  }
}

export async function getArticleBySlugDB(slug: string) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.slug = ?`,
      [slug]
    );

    if (rows.length === 0) return null;
    return normalizeArticle(rows[0]);
  } catch (error) {
    console.error('getArticleBySlugDB error:', error);
    return null;
  }
}

export async function getRelatedArticlesDB(slug: string, categoryId: number, count: number = 4) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.category_id = ? AND a.slug != ? AND a.status = 'Published'
       ORDER BY a.created_at DESC
       LIMIT ?`,
      [categoryId, slug, count]
    );
    return rows.map(normalizeArticle);
  } catch (error) {
    console.error('getRelatedArticlesDB error:', error);
    return [];
  }
}

export async function getFeaturedArticlesDB() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.featured = TRUE AND a.status = 'Published'
       ORDER BY a.created_at DESC`
    );
    return rows.map(normalizeArticle);
  } catch (error) {
    console.error('getFeaturedArticlesDB error:', error);
    return [];
  }
}

export async function getArticlesBySearchDB(query: string, count: number = 20) {
  try {
    const searchTerm = `%${query}%`;
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.status = 'Published' AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.tags LIKE ?)
       ORDER BY a.created_at DESC
       LIMIT ?`,
      [searchTerm, searchTerm, searchTerm, count]
    );
    return rows.map(normalizeArticle);
  } catch (error) {
    console.error('getArticlesBySearchDB error:', error);
    return [];
  }
}

// ------- CATEGORY QUERIES -------

export async function getCategoriesDB() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT c.*, COUNT(a.id) as article_count
       FROM categories c
       LEFT JOIN article_categories ac ON c.id = ac.category_id
       LEFT JOIN articles a ON ac.article_id = a.id AND a.status = 'Published'
       GROUP BY c.id
       ORDER BY c.sort_order ASC, c.name ASC`
    );
    return rows;
  } catch (error) {
    console.error('getCategoriesDB error:', error);
    return [];
  }
}

export async function getCategoryBySlugDB(slug: string) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM categories WHERE slug = ?',
      [slug]
    );
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('getCategoryBySlugDB error:', error);
    return null;
  }
}

export async function getAllArticleSlugsForSitemapDB() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT slug, updated_at, created_at FROM articles WHERE status = "Published" ORDER BY created_at DESC LIMIT 500'
    );
    return rows;
  } catch (error) {
    console.error('getAllArticleSlugsForSitemapDB error:', error);
    return [];
  }
}
