'use client';
import { useState, useEffect } from 'react';

export default function MediaPicker({ onSelect, onClose }: { onSelect: (url: string) => void, onClose: () => void }) {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/media')
      .then(res => res.json())
      .then(data => {
        setMedia(data.media || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '90%', maxWidth: '900px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1.5rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#6b7280' }}>✕</button>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 'bold' }}>Select from Media Library</h2>
        
        {loading ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: '#6b7280' }}>Loading media...</p>
          </div>
        ) : media.length === 0 ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</span>
            <p style={{ color: '#6b7280' }}>Your media library is empty.</p>
          </div>
        ) : (
          <div style={{ overflowY: 'auto', flex: 1, paddingRight: '0.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
              {media.map(m => (
                <div 
                  key={m.id} 
                  onClick={() => onSelect(m.file_path)} 
                  style={{ cursor: 'pointer', borderRadius: '8px', overflow: 'hidden', border: '2px solid transparent', transition: 'all 0.2s', backgroundColor: '#f3f4f6' }} 
                  onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary-color)'} 
                  onMouseOut={e => e.currentTarget.style.borderColor = 'transparent'}
                >
                  {m.type === 'image' ? (
                    <img src={m.file_path} alt={m.name} style={{ width: '100%', height: '140px', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#6b7280' }}>
                      <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📄</span>
                      <span style={{ fontSize: '0.75rem', padding: '0 0.5rem', textAlign: 'center', wordBreak: 'break-all' }}>{m.name}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
