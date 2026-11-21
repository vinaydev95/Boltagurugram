import { executeStatement, queryRows } from '@/lib/db';
import { QueryCache } from '@/lib/query-cache';

const queryCache = new QueryCache({
  onError: (key, error) => console.error(`Public content query failed (${key}):`, error),
});

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
  return queryCache.get(`latest_${count}`, async () => {
    const rows = await queryRows(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.status = 'Published'
       ORDER BY a.created_at DESC LIMIT ?`, [count]
    );
    return rows.map(normalizeArticle);
  });
}

export async function getTrendingArticlesDB(count: number = 5) {
  return queryCache.get(`trending_${count}`, async () => {
    const rows = await queryRows(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.status = 'Published'
       ORDER BY a.views DESC LIMIT ?`, [count]
    );
    return rows.map(normalizeArticle);
  });
}

export async function getArticlesByCategoryDB(categorySlug: string, count: number = 10) {
  return queryCache.get(`cat_${categorySlug}_${count}`, async () => {
    const rows = await queryRows(
      `SELECT a.*, c_primary.name as category_name, c_primary.slug as category_slug, c_primary.color as category_color
       FROM articles a
       JOIN article_categories ac ON a.id = ac.article_id
       JOIN categories c_search ON ac.category_id = c_search.id
       LEFT JOIN categories c_primary ON a.category_id = c_primary.id
       WHERE c_search.slug = ? AND a.status = 'Published'
       ORDER BY a.created_at DESC LIMIT ?`, [categorySlug, count]
    );
    return rows.map(normalizeArticle);
  });
}

export async function incrementArticleViewsDB(slug: string) {
  await executeStatement(
    "UPDATE articles SET views = views + 1 WHERE slug = ? AND status = 'Published'",
    [slug]
  );
}

export async function getArticleBySlugDB(slug: string) {
  return queryCache.get(`article_${slug}`, async () => {
    const rows = await queryRows(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.slug = ? AND a.status = 'Published'`, [slug]
    );
    return rows.length === 0 ? null : normalizeArticle(rows[0]);
  }, 120000);
}

export async function getRelatedArticlesDB(slug: string, categoryId: number, count: number = 4) {
  return queryCache.get(`related_${categoryId}_${slug}_${count}`, async () => {
    const rows = await queryRows(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.category_id = ? AND a.slug != ? AND a.status = 'Published'
       ORDER BY a.created_at DESC LIMIT ?`, [categoryId, slug, count]
    );
    return rows.map(normalizeArticle);
  });
}

export async function getFeaturedArticlesDB() {
  return queryCache.get('featured', async () => {
    const rows = await queryRows(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.featured = TRUE AND a.status = 'Published'
       ORDER BY a.created_at DESC`
    );
    return rows.map(normalizeArticle);
  });
}

export async function getArticlesBySearchDB(query: string, count: number = 20) {
  return queryCache.get(`search_${query}_${count}`, async () => {
    const searchTerm = `%${query}%`;
    const rows = await queryRows(
      `SELECT a.*, c.name as category_name, c.slug as category_slug, c.color as category_color
       FROM articles a
       LEFT JOIN categories c ON a.category_id = c.id
       WHERE a.status = 'Published' AND (a.title LIKE ? OR a.excerpt LIKE ? OR a.tags LIKE ?)
       ORDER BY a.created_at DESC LIMIT ?`, [searchTerm, searchTerm, searchTerm, count]
    );
    return rows.map(normalizeArticle);
  });
}

// ------- CATEGORY QUERIES -------

export async function getCategoriesDB() {
  return queryCache.get('all_categories', () => queryRows(
    `SELECT c.*, COUNT(a.id) as article_count
     FROM categories c
     LEFT JOIN article_categories ac ON c.id = ac.category_id
     LEFT JOIN articles a ON ac.article_id = a.id AND a.status = 'Published'
     GROUP BY c.id
     ORDER BY c.sort_order ASC, c.name ASC`
  ), 300000);
}

export async function getCategoryBySlugDB(slug: string) {
  return queryCache.get(`cat_slug_${slug}`, async () => {
    const rows = await queryRows('SELECT * FROM categories WHERE slug = ?', [slug]);
    return rows.length === 0 ? null : rows[0];
  }, 300000);
}

export async function getAllArticleSlugsForSitemapDB() {
  return queryCache.get('sitemap_articles', () => queryRows(
    'SELECT slug, updated_at, created_at FROM articles WHERE status = "Published" ORDER BY created_at DESC LIMIT 500'
  ), 300000);
}
