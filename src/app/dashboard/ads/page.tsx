'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import MediaPicker from '@/components/MediaPicker';

const LiveTimer = ({ expiresAt }: { expiresAt: string }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!expiresAt) return;
    const targetDate = new Date(expiresAt).getTime();
    
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft('Expired');
        return;
      }

      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));

      let display = '';
      if (days > 0) display += `${days}d `;
      display += `${hours}h ${minutes}m ${seconds}s`;
      setTimeLeft(display);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (!expiresAt) return null;
  
  if (timeLeft === 'Expired') {
    return <span style={{ fontSize: '0.75rem', color: '#ef4444', backgroundColor: '#fee2e2', padding: '0.1rem 0.3rem', borderRadius: '4px', marginLeft: '0.5rem' }}>Expired</span>;
  }

  return <span style={{ fontSize: '0.75rem', color: '#3b82f6', backgroundColor: '#eff6ff', padding: '0.1rem 0.3rem', borderRadius: '4px', marginLeft: '0.5rem' }}>Expires in {timeLeft}</span>;
};

export default function AdsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    id: null as number | null,
    title: '',
    position: ['home_banner'] as string[],
    image_url: '',
    target_url: '',
    expires_at: '' as string | null,
    active: true
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/dashboard');
      } else {
        fetchAds();
      }
    }
  }, [user, authLoading, router]);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/advertisements');
      const data = await res.json();
      setAds(data.advertisements || []);
    } catch (err) {
      console.error('Failed to fetch ads', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({ id: null, title: '', position: ['home_banner'], image_url: '', target_url: '', expires_at: '', active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (ad: any) => {
    let localExpiresAt = '';
    if (ad.expires_at) {
      const d = new Date(ad.expires_at);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      localExpiresAt = d.toISOString().slice(0, 16);
    }
    setFormData({ ...ad, position: ad.position ? ad.position.split(',') : [], expires_at: localExpiresAt });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        position: formData.position.join(',')
      };
      if (formData.id) {
        await fetch(`/api/advertisements/${formData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/advertisements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setIsModalOpen(false);
      fetchAds();
    } catch (err) {
      alert('Error saving advertisement');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this advertisement?')) return;
    try {
      await fetch(`/api/advertisements/${id}`, { method: 'DELETE' });
      fetchAds();
    } catch (err) {
      alert('Error deleting advertisement');
    }
  };

  const toggleActive = async (ad: any) => {
    try {
      await fetch(`/api/advertisements/${ad.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !ad.active }),
      });
      fetchAds();
    } catch (err) {
      alert('Error updating status');
    }
  };

  if (authLoading || loading) return <p>Loading advertisements...</p>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>Advertisement Management</h1>
        <button onClick={openAddModal} style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.5rem 1rem', borderRadius: '4px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
          + Add Advertisement
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb', borderBottom: '1px solid var(--border-color)' }}>
              <th style={{ padding: '1rem' }}>Banner</th>
              <th style={{ padding: '1rem' }}>Title</th>
              <th style={{ padding: '1rem' }}>Position</th>
              <th style={{ padding: '1rem' }}>Target URL</th>
              <th style={{ padding: '1rem' }}>Status</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>No advertisements found</td></tr>
            ) : ads.map(ad => (
              <tr key={ad.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                <td style={{ padding: '1rem' }}>
                  <img src={ad.image_url} alt={ad.title} style={{ height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                </td>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{ad.title}</td>
                <td style={{ padding: '1rem' }}>{ad.position}</td>
                <td style={{ padding: '1rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}><a href={ad.target_url} target="_blank" rel="noreferrer" style={{color: '#3b82f6'}}>{ad.target_url}</a></td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={() => toggleActive(ad)} style={{ padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', border: 'none', cursor: 'pointer', backgroundColor: ad.active ? '#dcfce7' : '#fee2e2', color: ad.active ? '#166534' : '#991b1b' }}>
                      {ad.active ? 'Active' : 'Inactive'}
                    </button>
                    <LiveTimer expiresAt={ad.expires_at} />
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button onClick={() => openEditModal(ad)} style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white' }}>Edit</button>
                  <button onClick={() => handleDelete(ad.id)} style={{ padding: '0.25rem 0.5rem', border: '1px solid #fecaca', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#fef2f2', color: '#dc2626' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', width: '100%', maxWidth: '500px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>{formData.id ? 'Edit' : 'Add'} Advertisement</h2>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Positions</label>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {['home_banner', 'sidebar', 'article_bottom'].map(pos => (
                    <label key={pos} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer' }}>
                      <input 
                        type="checkbox" 
                        checked={formData.position.includes(pos)} 
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, position: [...formData.position, pos]});
                          } else {
                            setFormData({...formData, position: formData.position.filter(p => p !== pos)});
                          }
                        }} 
                      />
                      {pos === 'home_banner' ? 'Home Banner' : pos === 'sidebar' ? 'Sidebar' : 'Article Bottom'}
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Target URL</label>
                <input type="url" value={formData.target_url} onChange={e => setFormData({...formData, target_url: e.target.value})} style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} placeholder="https://example.com" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Expiration Date & Time</label>
                <input 
                  type="datetime-local" 
                  value={formData.expires_at || ''} 
                  onChange={e => setFormData({...formData, expires_at: e.target.value})} 
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} 
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.25rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>Leave empty for no expiration. To extend duration, simply pick a new date!</span>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem' }}>Banner Image URL</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input required type="text" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} style={{ flex: 1, padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '4px' }} />
                  <button type="button" onClick={() => setIsMediaPickerOpen(true)} style={{ padding: '0.5rem 1rem', border: '1px solid var(--border-color)', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#f3f4f6' }}>Select</button>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <input type="checkbox" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} id="active-checkbox" />
                <label htmlFor="active-checkbox" style={{ cursor: 'pointer' }}>Active</label>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.5rem 1rem', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', color: '#6b7280' }}>Cancel</button>
                <button type="submit" style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', backgroundColor: 'var(--primary-color)', color: 'white' }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isMediaPickerOpen && (
        <MediaPicker 
          onClose={() => setIsMediaPickerOpen(false)} 
          onSelect={(url) => { setFormData({...formData, image_url: url}); setIsMediaPickerOpen(false); }} 
        />
      )}
    </div>
  );
}
