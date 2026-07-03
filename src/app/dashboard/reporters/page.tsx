'use client';

import { useState, useEffect } from 'react';

interface Reporter {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: string;
  avatar_url: string | null;
  bio: string | null;
  article_count: number;
  created_at: string;
}

export default function ReportersPage() {
  const [reporters, setReporters] = useState<Reporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReporter, setEditingReporter] = useState<Reporter | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Reporter@2026');
  const [role, setRole] = useState('Reporter');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchReporters();
  }, []);

  const fetchReporters = async () => {
    try {
      const res = await fetch('/api/reporters');
      const data = await res.json();
      setReporters(data.reporters || []);
    } catch (err) {
      console.error('Failed to fetch reporters:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingReporter(null);
    setName('');
    setEmail('');
    setPassword('Reporter@2026');
    setRole('Reporter');
    setBio('');
    setShowModal(true);
  };

  const handleOpenEditModal = (reporter: Reporter) => {
    setEditingReporter(reporter);
    setName(reporter.name);
    setEmail(reporter.email);
    setPassword(reporter.password || 'Reporter@2026');
    setRole(reporter.role || 'Reporter');
    setBio(reporter.bio || '');
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !email.trim()) {
      alert('Name and Email are required.');
      return;
    }
    setSaving(true);

    const payload = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      role: 'Reporter',
      bio: null,
    };

    try {
      if (editingReporter) {
        // Edit existing
        const res = await fetch(`/api/reporters/${editingReporter.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setReporters(
            reporters.map((r) =>
              r.id === editingReporter.id ? { ...r, ...data.reporter } : r
            )
          );
          setShowModal(false);
        } else {
          alert(data.error || 'Failed to update reporter');
        }
      } else {
        // Add new
        const res = await fetch('/api/reporters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (data.success) {
          setReporters([...reporters, { ...data.reporter, article_count: 0 }]);
          setShowModal(false);
        } else {
          alert(data.error || 'Failed to add reporter');
        }
      }
    } catch {
      alert('Error saving reporter');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (reporter: Reporter) => {
    if (
      !confirm(
        `Are you sure you want to delete ${reporter.name}? Any articles they wrote will show as written by 'Admin'.`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(`/api/reporters/${reporter.id}`, { method: 'DELETE' });
      if (res.ok) {
        setReporters(reporters.filter((r) => r.id !== reporter.id));
      } else {
        alert('Failed to delete reporter');
      }
    } catch {
      alert('Error deleting reporter');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
        Loading reporters...
      </div>
    );
  }

  return (
    <div>
      <div className="dashboard-header-actions" style={{ marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Reporters</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Manage editorial staff, reporters, and content contributors.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          style={{
            padding: '0.75rem 1.5rem',
            borderRadius: '6px',
            border: 'none',
            backgroundColor: 'var(--primary-color)',
            color: 'white',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(229, 9, 20, 0.2)',
          }}
        >
          + Add Reporter
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '8px',
              width: '95%',
              maxWidth: '450px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              boxSizing: 'border-box',
            }}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              {editingReporter ? 'Edit Reporter' : 'Add New Reporter'}
            </h2>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: '500' }}>Name</label>
              <input
                type="text"
                placeholder="Full Name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: '500' }}>Email</label>
              <input
                type="email"
                placeholder="email@newsportal.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: '500' }}>Login Password</label>
              <input
                type="text"
                placeholder="Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  outline: 'none',
                  fontSize: '1rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>



            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'var(--primary-color)',
                  color: 'white',
                  fontWeight: 'bold',
                  cursor: saving ? 'not-allowed' : 'pointer',
                  opacity: saving ? 0.6 : 1,
                }}
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reporters Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <div className="table-scroll-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-light)' }}>Name</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-light)' }}>Email</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-light)' }}>Password</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-light)' }}>Published Articles</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: '600', color: 'var(--text-light)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reporters.map((reporter) => (
                <tr key={reporter.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--primary-color)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.85rem',
                      }}
                    >
                      {reporter.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <div style={{ fontWeight: '600' }}>{reporter.name}</div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-light)' }}>{reporter.email}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-light)', fontFamily: 'monospace' }}>{reporter.password || 'Reporter@2026'}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ backgroundColor: '#f3f4f6', padding: '0.2rem 0.6rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {reporter.article_count}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => handleOpenEditModal(reporter)}
                        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(reporter)}
                        style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {reporters.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>
                    No reporters found. Add one to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
