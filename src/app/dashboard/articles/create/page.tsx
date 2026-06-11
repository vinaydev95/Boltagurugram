'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MediaPicker from '@/components/MediaPicker';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function CreateArticlePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('write');
  const [headline, setHeadline] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');
  const [showMediaPicker, setShowMediaPicker] = useState(false);

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

  const saveArticle = async (status: 'Draft' | 'Published') => {
    if (!headline) {
      alert('Please enter a headline.');
      return;
    }
    if (status === 'Published' && (!content || !categoryId)) {
      alert('Please fill in Content and select a Category before publishing.');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: headline,
          excerpt: excerpt || headline.substring(0, 150),
          content: `<p>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`,
          category_id: categoryId ? parseInt(categoryId) : null,
          image_url: imageUrl || null,
          author: 'Admin',
          status,
          tags: tags || null,
          featured: false,
          read_time: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(status === 'Published' ? '✓ Article published!' : '✓ Draft saved!');
        setTimeout(() => {
          router.push('/dashboard/articles');
        }, 1500);
      } else {
        alert(data.error || 'Failed to save article');
      }
    } catch {
      alert('Error saving article');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImageUrl(data.media.file_path);
      } else {
        alert(data.error || 'Failed to upload image');
      }
    } catch (err) {
      alert('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="dashboard-header-actions" style={{ marginBottom: '2rem' }}>
        <div>
          <Link href="/dashboard/articles" style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'inline-block' }}>← Back to Articles</Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Create New Article</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {message && <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}>{message}</span>}
          <button onClick={() => saveArticle('Draft')} disabled={saving} style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button onClick={() => saveArticle('Published')} disabled={saving} style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px rgba(229, 9, 20, 0.2)', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Publishing...' : 'Publish Article'}
          </button>
        </div>
      </div>

      <div className="dashboard-editor-grid">
        {/* Main Editor Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>Headline (H1)</label>
            <input
              type="text"
              placeholder="Enter a catchy headline..."
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              style={{ width: '100%', padding: '1rem', fontSize: '1.5rem', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--text-dark)' }}>Excerpt (Short description)</label>
            <textarea
              placeholder="Brief summary of the article (shown in listings)..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              style={{ width: '100%', minHeight: '80px', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', resize: 'vertical', fontFamily: 'inherit', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', backgroundColor: '#f9fafb' }}>
              <button
                onClick={() => setActiveTab('write')}
                style={{ flex: 1, padding: '1rem', border: 'none', background: activeTab === 'write' ? 'white' : 'transparent', borderBottom: activeTab === 'write' ? '2px solid var(--primary-color)' : '2px solid transparent', fontWeight: activeTab === 'write' ? 'bold' : 'normal', cursor: 'pointer' }}
              >Write Content</button>
              <button
                onClick={() => setActiveTab('preview')}
                style={{ flex: 1, padding: '1rem', border: 'none', background: activeTab === 'preview' ? 'white' : 'transparent', borderBottom: activeTab === 'preview' ? '2px solid var(--primary-color)' : '2px solid transparent', fontWeight: activeTab === 'preview' ? 'bold' : 'normal', cursor: 'pointer' }}
              >Preview</button>
            </div>

            {activeTab === 'write' ? (
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                  {['B', 'I', 'U', 'H2', 'H3', '"', '🔗', '📷'].map(tool => (
                    <button key={tool} style={{ width: '32px', height: '32px', border: '1px solid var(--border-color)', borderRadius: '4px', background: 'white', cursor: 'pointer', fontWeight: 'bold' }}>{tool}</button>
                  ))}
                </div>
                <textarea
                  placeholder="Write the article content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  style={{ width: '100%', minHeight: '400px', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '6px', resize: 'vertical', fontFamily: 'inherit', fontSize: '1rem', lineHeight: '1.6', outline: 'none', boxSizing: 'border-box' }}
                ></textarea>
              </div>
            ) : (
              <div style={{ padding: '2rem', minHeight: '400px' }}>
                {content ? (
                  <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{headline || 'Untitled'}</h1>
                    <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#374151', whiteSpace: 'pre-wrap' }}>{content}</div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-light)', fontStyle: 'italic', textAlign: 'center', marginTop: '4rem' }}>Start writing to see a preview...</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Article Settings</h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Category</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white' }}>
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Tags (Comma separated)</label>
              <input type="text" placeholder="e.g. elections, economy" value={tags} onChange={(e) => setTags(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Author</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '6px', backgroundColor: '#f9fafb' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem' }}>A</div>
                <span style={{ fontSize: '0.9rem' }}>Admin User</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Featured Image</h3>
            
            <input type="file" accept="image/*" id="featured-image-upload" style={{ display: 'none' }} onChange={handleImageUpload} disabled={uploadingImage} />
            
            {imageUrl ? (
              <div style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <img src={imageUrl} alt="Featured preview" style={{ width: '100%', display: 'block' }} />
                <button 
                  onClick={() => setImageUrl('')}
                  style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.6)', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <label htmlFor="featured-image-upload" style={{ display: 'block', border: '2px dashed var(--border-color)', borderRadius: '6px', padding: '2rem', textAlign: 'center', backgroundColor: '#f9fafb', cursor: uploadingImage ? 'not-allowed' : 'pointer', opacity: uploadingImage ? 0.6 : 1 }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{uploadingImage ? '⏳' : '📸'}</div>
                <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>{uploadingImage ? 'Uploading image...' : 'Click to upload featured image'}</p>
                <p style={{ color: '#9ca3af', fontSize: '0.75rem', marginTop: '0.5rem' }}>Recommended size: 1200x630px</p>
              </label>
            )}
            
            <button 
              onClick={() => setShowMediaPicker(true)} 
              style={{ width: '100%', marginTop: '1rem', padding: '0.75rem', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', color: 'var(--text-dark)' }}
            >
              🖼️ Choose from Media Library
            </button>
          </div>

          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>SEO Settings</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Meta Title <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>({metaTitle.length}/60)</span></label>
              <input type="text" placeholder="60 characters max" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} maxLength={60} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Meta Description <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>({metaDesc.length}/150)</span></label>
              <textarea placeholder="150 characters max" value={metaDesc} onChange={(e) => setMetaDesc(e.target.value)} maxLength={150} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border-color)', resize: 'vertical', minHeight: '80px', boxSizing: 'border-box' }}></textarea>
            </div>
          </div>
        </div>
      </div>
      {showMediaPicker && (
        <MediaPicker 
          onSelect={(url) => { setImageUrl(url); setShowMediaPicker(false); }} 
          onClose={() => setShowMediaPicker(false)} 
        />
      )}
    </div>
  );
}
