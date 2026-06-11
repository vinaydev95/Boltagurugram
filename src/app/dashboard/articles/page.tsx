'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Article {
  id: number;
  slug: string;
  title: string;
  status: string;
  views: number;
  created_at: string;
  category_name: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;

  const fetchArticles = useCallback(async () => {
    try {
      const offset = (page - 1) * limit;
      let url = `/api/articles?limit=${limit}&offset=${offset}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (categoryFilter !== 'All') {
        const cat = categories.find(c => c.name === categoryFilter);
        if (cat) url += `&category=${categoryFilter.toLowerCase()}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setArticles(data.articles || []);
      setTotal(data.pagination?.total || 0);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, categories, page, limit]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchArticles();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchArticles]);

  const handleDelete = async (slug: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      const res = await fetch(`/api/articles/${slug}`, { method: 'DELETE' });
      if (res.ok) {
        setArticles(articles.filter(a => a.slug !== slug));
      } else {
        alert('Failed to delete article');
      }
    } catch {
      alert('Error deleting article');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatViews = (views: number) => {
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return String(views);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Manage Articles</h1>
        <Link href="/dashboard/articles/create" style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '6px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(229, 9, 20, 0.2)' }}>
          + Create New Article
        </Link>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', backgroundColor: '#f9fafb' }}>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--border-color)', width: '300px', outline: 'none' }}
          />
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            style={{ padding: '0.5rem 1rem', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}
          >
            <option>All</option>
            {categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>Loading articles...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)', backgroundColor: '#f9fafb' }}>
                <th style={{ padding: '1rem 1.5rem' }}>Title</th>
                <th style={{ padding: '1rem 1.5rem' }}>Category</th>
                <th style={{ padding: '1rem 1.5rem' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem' }}>Views</th>
                <th style={{ padding: '1rem 1.5rem' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-light)' }}>No articles found.</td></tr>
              ) : (
                articles.map(article => (
                  <tr key={article.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <Link href={`/article/${article.slug}`} style={{ color: 'var(--text-dark)' }}>{article.title}</Link>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ backgroundColor: '#f3f4f6', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem' }}>{article.category_name || 'Uncategorized'}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        backgroundColor: article.status === 'Published' ? '#d1fae5' : '#fef3c7',
                        color: article.status === 'Published' ? '#065f46' : '#92400e',
                        padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 'bold'
                      }}>{article.status}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-light)' }}>{formatViews(article.views)}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-light)' }}>{formatDate(article.created_at)}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <Link href={`/article/${article.slug}`} style={{ color: '#3b82f6', fontWeight: 'bold', marginRight: '1rem' }} target="_blank">View</Link>
                      <Link href={`/dashboard/articles/edit/${article.slug}`} style={{ color: '#f59e0b', fontWeight: 'bold', marginRight: '1rem' }}>Edit</Link>
                      <button onClick={() => handleDelete(article.slug)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        <div style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', color: 'var(--text-light)', fontSize: '0.9rem' }}>
          <span>Showing {articles.length > 0 ? (page - 1) * limit + 1 : 0} to {Math.min(page * limit, total)} of {total} articles</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={() => setPage(p => Math.max(1, p - 1))} 
              disabled={page === 1}
              style={{ padding: '0.25rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'white', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
            >
              Previous
            </button>
            <button 
              onClick={() => setPage(p => p + 1)} 
              disabled={page * limit >= total}
              style={{ padding: '0.25rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'white', cursor: page * limit >= total ? 'not-allowed' : 'pointer', opacity: page * limit >= total ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
