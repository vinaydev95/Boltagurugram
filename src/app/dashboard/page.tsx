'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Stats {
  totalArticles: number;
  published: number;
  drafts: number;
  totalViews: number;
  totalCategories: number;
  totalMedia: number;
}

interface RecentArticle {
  id: number;
  slug: string;
  title: string;
  status: string;
  views: number;
  created_at: string;
  category_name: string;
  category_color: string;
}

interface CategoryBreakdown {
  id: number;
  name: string;
  color: string;
  article_count: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentArticles, setRecentArticles] = useState<RecentArticle[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/dashboard/stats');
        const data = await res.json();
        setStats(data.stats);
        setRecentArticles(data.recentArticles || []);
        setCategoryBreakdown(data.categoryBreakdown || []);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const formatViews = (views: number) => {
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return String(views);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', color: 'var(--text-light)' }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>Dashboard Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid var(--primary-color)' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Articles</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{stats?.totalArticles || 0}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #10b981' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Published</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#10b981' }}>{stats?.published || 0}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #f59e0b' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Drafts</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#f59e0b' }}>{stats?.drafts || 0}</p>
        </div>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderLeft: '4px solid #3b82f6' }}>
          <h3 style={{ color: 'var(--text-light)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Views</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{formatViews(stats?.totalViews || 0)}</p>
        </div>
      </div>

      {/* Categories summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Articles</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-light)' }}>
                <th style={{ padding: '1rem 0' }}>Title</th>
                <th style={{ padding: '1rem 0' }}>Category</th>
                <th style={{ padding: '1rem 0' }}>Status</th>
                <th style={{ padding: '1rem 0' }}>Views</th>
              </tr>
            </thead>
            <tbody>
              {recentArticles.map(article => (
                <tr key={article.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 0', fontWeight: '500', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <Link href={`/article/${article.slug}`} style={{ color: 'var(--text-dark)' }}>{article.title}</Link>
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <span style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{article.category_name}</span>
                  </td>
                  <td style={{ padding: '1rem 0' }}>
                    <span style={{
                      backgroundColor: article.status === 'Published' ? '#d1fae5' : '#fef3c7',
                      color: article.status === 'Published' ? '#065f46' : '#92400e',
                      padding: '0.25rem 0.5rem', borderRadius: '9999px', fontSize: '0.8rem'
                    }}>{article.status}</span>
                  </td>
                  <td style={{ padding: '1rem 0', color: 'var(--text-light)' }}>{formatViews(article.views)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Categories</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {categoryBreakdown.map(cat => (
              <div key={cat.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontWeight: '500' }}>{cat.name}</span>
                <span style={{ backgroundColor: cat.color + '20', color: cat.color, padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{cat.article_count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
