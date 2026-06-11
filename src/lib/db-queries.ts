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
}

export async function getTrendingArticlesDB(count: number = 5) {
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
}

export async function getArticlesByCategoryDB(categorySlug: string, count: number = 10) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     WHERE c.slug = ? AND a.status = 'Published'
     ORDER BY a.created_at DESC
     LIMIT ?`,
    [categorySlug, count]
  );
  return rows.map(normalizeArticle);
}

export async function getArticleBySlugDB(slug: string) {
  // Increment views
  await pool.query('UPDATE articles SET views = views + 1 WHERE slug = ?', [slug]);

  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     WHERE a.slug = ?`,
    [slug]
  );

  if (rows.length === 0) return null;
  return normalizeArticle(rows[0]);
}

export async function getRelatedArticlesDB(slug: string, categoryId: number, count: number = 4) {
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
}

export async function getFeaturedArticlesDB() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     WHERE a.featured = TRUE AND a.status = 'Published'
     ORDER BY a.created_at DESC`
  );
  return rows.map(normalizeArticle);
}

export async function getArticlesBySearchDB(query: string, count: number = 20) {
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
}

// ------- CATEGORY QUERIES -------

export async function getCategoriesDB() {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT c.*, COUNT(a.id) as article_count
     FROM categories c
     LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'Published'
     GROUP BY c.id
     ORDER BY c.name ASC`
  );
  return rows;
}

export async function getCategoryBySlugDB(slug: string) {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM categories WHERE slug = ?',
    [slug]
  );
  return rows.length > 0 ? rows[0] : null;
}
