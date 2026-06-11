'use client';

import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  article_count: number;
}

export default function CategoriesPage() {
  const [cats, setCats] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newColor, setNewColor] = useState('#6b7280');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCats(data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName.trim(), color: newColor }),
      });
      const data = await res.json();
      if (data.success) {
        setCats([...cats, { ...data.category, article_count: 0 }]);
        setNewName('');
        setNewColor('#6b7280');
        setShowModal(false);
      } else {
        alert(data.error || 'Failed to add category');
      }
    } catch {
      alert('Error adding category');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure? Articles in this category will become uncategorized.')) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCats(cats.filter(c => c.id !== id));
      } else {
        alert('Failed to delete category');
      }
    } catch {
      alert('Error deleting category');
    }
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>Loading categories...</div>;
  }

  return (
    <div>
      <div className="dashboard-header-actions">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Categories</h1>
        <button onClick={() => setShowModal(true)} style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 6px rgba(229, 9, 20, 0.2)' }}>
          + Add Category
        </button>
      </div>

      {/* Add Category Modal */}
      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '90%', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Add New Category</h2>
            <input
              type="text"
              placeholder="Category name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', marginBottom: '1rem', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
            />
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Color</label>
              <input
                type="color"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                style={{ width: '60px', height: '36px', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleAdd} disabled={saving} style={{ padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div className="table-scroll-wrapper">
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-light)' }}>Name</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-light)' }}>Slug</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-light)' }}>Total Articles</th>
              <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-light)', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cats.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>
                  <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color, marginRight: '0.5rem' }}></span>
                  {cat.name}
                </td>
                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-light)' }}>/{cat.slug}</td>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>{cat.article_count}</span>
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <button onClick={() => handleDelete(cat.id)} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
