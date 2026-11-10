'use client';

import { useState, useEffect } from 'react';

interface MediaFile {
  id: number;
  name: string;
  file_path: string;
  size: string;
  type: string;
  created_at: string;
}

export default function MediaPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [applyWatermark, setApplyWatermark] = useState(true);
  const [watermarkingId, setWatermarkingId] = useState<number | null>(null);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/media');
      const data = await res.json();
      setFiles(data.media || []);
    } catch (err) {
      console.error('Failed to fetch media:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,video/*';
    input.multiple = true;
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const selectedFiles = target.files;
      if (!selectedFiles || selectedFiles.length === 0) return;

      setUploading(true);
      for (let i = 0; i < selectedFiles.length; i++) {
        const formData = new FormData();
        formData.append('file', selectedFiles[i]);
        formData.append('watermark', applyWatermark ? 'true' : 'false');
        try {
          const res = await fetch('/api/media', { method: 'POST', body: formData });
          const data = await res.json();
          if (data.success) {
            setFiles(prev => [data.media, ...prev]);
          } else {
            alert(`Failed to upload ${selectedFiles[i].name}: ${data.error}`);
          }
        } catch {
          alert(`Error uploading ${selectedFiles[i].name}`);
        }
      }
      setUploading(false);
    };
    input.click();
  };

  const handleWatermarkExisting = async (id: number) => {
    setWatermarkingId(id);
    try {
      const res = await fetch(`/api/media/${id}/watermark`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ position: 'top-right' })
      });
      const data = await res.json();
      if (data.success) {
        setFiles(prev => prev.map(f => (f.id === id ? { ...data.media, file_path: `${data.media.file_path}?t=${Date.now()}` } : f)));
        alert('Logo watermark applied successfully!');
      } else {
        alert(data.error || 'Failed to apply watermark');
      }
    } catch {
      alert('Error applying watermark');
    } finally {
      setWatermarkingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    try {
      const res = await fetch(`/api/media/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setFiles(files.filter(f => f.id !== id));
      } else {
        alert('Failed to delete file');
      }
    } catch {
      alert('Error deleting file');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>Loading media...</div>;
  }

  return (
    <div>
      <div className="dashboard-header-actions">
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Media Library</h1>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', cursor: 'pointer', backgroundColor: 'white', padding: '0.5rem 0.8rem', borderRadius: '6px', border: '1px solid var(--border-color)', userSelect: 'none' }} title="Automatically stamps your news logo watermark in the top-right corner of uploaded photos">
            <input type="checkbox" checked={applyWatermark} onChange={e => setApplyWatermark(e.target.checked)} />
            <span style={{ fontWeight: 500 }}>💧 Watermark Logo</span>
          </label>
          <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
            <button onClick={() => setViewMode('grid')} style={{ padding: '0.5rem 1rem', border: 'none', backgroundColor: viewMode === 'grid' ? 'var(--primary-color)' : 'white', color: viewMode === 'grid' ? 'white' : 'var(--text-dark)', cursor: 'pointer', fontWeight: 'bold' }}>Grid</button>
            <button onClick={() => setViewMode('list')} style={{ padding: '0.5rem 1rem', border: 'none', backgroundColor: viewMode === 'list' ? 'var(--primary-color)' : 'white', color: viewMode === 'list' ? 'white' : 'var(--text-dark)', cursor: 'pointer', fontWeight: 'bold' }}>List</button>
          </div>
          <button onClick={handleUpload} disabled={uploading} style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 'bold', cursor: uploading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px rgba(229, 9, 20, 0.2)', opacity: uploading ? 0.6 : 1 }}>
            {uploading ? 'Uploading...' : '+ Upload Media'}
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1.5rem' }}>
          {files.map((file) => (
            <div key={file.id} style={{ backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', position: 'relative' }}>
              <div style={{ height: '140px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {file.type === 'image' && file.file_path ? (
                  <img src={file.file_path} alt={file.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ fontSize: '2rem' }}>📸</span>
                )}
              </div>
              <div style={{ padding: '1rem' }}>
                <p style={{ fontWeight: '600', fontSize: '0.9rem', marginBottom: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.name}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-light)', fontSize: '0.75rem' }}>
                  <span>{file.size}</span>
                  <span>{formatDate(file.created_at)}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.75rem' }}>
                  {file.type === 'image' && (
                    <button
                      onClick={() => handleWatermarkExisting(file.id)}
                      disabled={watermarkingId === file.id}
                      style={{ flex: 1, padding: '0.4rem 0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: '#f9fafb', color: 'var(--text-dark)', fontSize: '0.75rem', cursor: watermarkingId === file.id ? 'not-allowed' : 'pointer', fontWeight: '500', opacity: watermarkingId === file.id ? 0.6 : 1 }}
                      title="Apply logo watermark to this image"
                    >
                      {watermarkingId === file.id ? 'Applying...' : '💧 Watermark'}
                    </button>
                  )}
                  <button onClick={() => handleDelete(file.id)} style={{ padding: '0.4rem 0.6rem', border: '1px solid #fecaca', borderRadius: '4px', backgroundColor: '#fef2f2', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '500' }}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div className="table-scroll-wrapper">
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-light)' }}>File Name</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-light)' }}>Type</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-light)' }}>Size</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-light)' }}>Date</th>
                <th style={{ padding: '1rem 1.5rem', color: 'var(--text-light)', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map(file => (
                <tr key={file.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>📸 {file.name}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-light)', textTransform: 'uppercase', fontSize: '0.85rem' }}>{file.type}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-light)' }}>{file.size}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-light)' }}>{formatDate(file.created_at)}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                    {file.type === 'image' && (
                      <button
                        onClick={() => handleWatermarkExisting(file.id)}
                        disabled={watermarkingId === file.id}
                        style={{ padding: '0.3rem 0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', backgroundColor: 'white', color: 'var(--text-dark)', fontSize: '0.8rem', cursor: watermarkingId === file.id ? 'not-allowed' : 'pointer' }}
                      >
                        {watermarkingId === file.id ? 'Applying...' : '💧 Watermark'}
                      </button>
                    )}
                    <button onClick={() => handleDelete(file.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontWeight: 'bold' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', color: 'var(--text-light)', fontSize: '0.9rem' }}>
        Total: {files.length} files
      </div>
    </div>
  );
}
