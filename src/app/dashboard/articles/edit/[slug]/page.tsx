'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import MediaPicker from '@/components/MediaPicker';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function EditArticlePage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { slug } = params;
  
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
  const [author, setAuthor] = useState('Admin');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [showInlineImagePicker, setShowInlineImagePicker] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const [activeFormats, setActiveFormats] = useState({
    b: false,
    i: false,
    u: false,
    h2: false,
    h3: false,
    quote: false,
    link: false,
  });

  const updateActiveFormats = () => {
    const editor = editorRef.current;
    if (!editor) return;

    const isAncestorTag = (tagName: string) => {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return false;
      let node: Node | null = selection.anchorNode;
      while (node && node !== editor) {
        if (node.nodeName === tagName) return true;
        node = node.parentNode;
      }
      return false;
    };

    setActiveFormats({
      b: document.queryCommandState('bold'),
      i: document.queryCommandState('italic'),
      u: document.queryCommandState('underline'),
      h2: document.queryCommandValue('formatBlock') === 'h2' || isAncestorTag('H2'),
      h3: document.queryCommandValue('formatBlock') === 'h3' || isAncestorTag('H3'),
      quote: document.queryCommandValue('formatBlock') === 'blockquote' || isAncestorTag('BLOCKQUOTE'),
      link: isAncestorTag('A'),
    });
  };

  const handleEditorInput = () => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const catRes = await fetch('/api/categories');
        const catData = await catRes.json();
        setCategories(catData.categories || []);

        const artRes = await fetch(`/api/articles/${slug}`);
        const artData = await artRes.json();
        
        if (artData.article) {
          const a = artData.article;
          setHeadline(a.title || '');
          setExcerpt(a.excerpt || '');
          setContent(a.content || '');
          setCategoryId(a.category_id ? String(a.category_id) : '');
          setTags(a.tags || '');
          setImageUrl(a.image_url || '');
          setAuthor(a.author || 'Admin');
        } else {
          alert('Article not found');
          router.push('/dashboard/articles');
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [slug, router]);

  useEffect(() => {
    if (editorRef.current && content && !isInitialized) {
      editorRef.current.innerHTML = content;
      setIsInitialized(true);
    }
  }, [content, isInitialized]);

  const insertInlineImage = (url: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    const imgHtml = `<figure style="margin: 1.5rem 0; text-align: center;"><img src="${url}" alt="Article image" style="max-width: 100%; border-radius: 8px; display: block; margin: 0 auto;" /></figure><p><br></p>`;
    document.execCommand('insertHTML', false, imgHtml);
    handleEditorInput();
  };

  const applyFormat = (tag: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    if (tag === 'b') {
      document.execCommand('bold', false);
    } else if (tag === 'i') {
      document.execCommand('italic', false);
    } else if (tag === 'u') {
      document.execCommand('underline', false);
    } else if (tag === 'h2') {
      const block = document.queryCommandValue('formatBlock');
      document.execCommand('formatBlock', false, block === 'h2' ? 'div' : 'h2');
    } else if (tag === 'h3') {
      const block = document.queryCommandValue('formatBlock');
      document.execCommand('formatBlock', false, block === 'h3' ? 'div' : 'h3');
    } else if (tag === 'quote') {
      const block = document.queryCommandValue('formatBlock');
      document.execCommand('formatBlock', false, block === 'blockquote' ? 'div' : 'blockquote');
    } else if (tag === 'link') {
      const url = window.prompt('Enter URL:', 'https://');
      if (url) {
        document.execCommand('createLink', false, url);
      }
    }

    handleEditorInput();
    updateActiveFormats();
  };

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
      const res = await fetch(`/api/articles/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: headline,
          excerpt: excerpt || headline.substring(0, 150),
          content: content,
          category_id: categoryId ? parseInt(categoryId) : null,
          image_url: imageUrl || null,
          author: author,
          status,
          tags: tags || null,
          featured: false,
          read_time: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min`,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(status === 'Published' ? '✓ Article updated!' : '✓ Draft updated!');
        setTimeout(() => {
          router.push('/dashboard/articles');
        }, 1500);
      } else {
        alert(data.error || 'Failed to update article');
      }
    } catch (err: any) {
      console.error('Error updating article:', err);
      alert(`Error updating article: ${err?.message || err || 'Unknown error'}`);
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

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-light)' }}>Loading article data...</div>;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="dashboard-header-actions" style={{ marginBottom: '2rem' }}>
        <div>
          <Link href="/dashboard/articles" style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'inline-block' }}>← Back to Articles</Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Edit Article</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {message && <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '0.9rem' }}>{message}</span>}
          <button onClick={() => saveArticle('Draft')} disabled={saving} style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: '1px solid var(--border-color)', backgroundColor: 'white', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving...' : 'Save as Draft'}
          </button>
          <button onClick={() => saveArticle('Published')} disabled={saving} style={{ padding: '0.75rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: 'var(--primary-color)', color: 'white', fontWeight: 'bold', cursor: saving ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px rgba(229, 9, 20, 0.2)', opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Publishing...' : 'Update & Publish'}
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
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap', alignItems: 'center' }}>
                  {[
                    { label: 'B', tag: 'b', title: 'Bold', style: { fontWeight: 'bold' } },
                    { label: 'I', tag: 'i', title: 'Italic', style: { fontStyle: 'italic' } },
                    { label: 'U', tag: 'u', title: 'Underline', style: { textDecoration: 'underline' } },
                    { label: 'H2', tag: 'h2', title: 'Heading 2', style: { fontWeight: 'bold' } },
                    { label: 'H3', tag: 'h3', title: 'Heading 3', style: { fontWeight: 'bold' } },
                    { label: '"', tag: 'quote', title: 'Blockquote', style: {} },
                    { label: '🔗', tag: 'link', title: 'Insert Link', style: {} },
                  ].map(tool => {
                    const isActive = activeFormats[tool.tag as keyof typeof activeFormats];
                    return (
                      <button
                        key={tool.tag}
                        type="button"
                        title={tool.title}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          applyFormat(tool.tag);
                        }}
                        style={{
                          width: '32px',
                          height: '32px',
                          border: isActive ? '1px solid var(--primary-color)' : '1px solid var(--border-color)',
                          borderRadius: '4px',
                          background: isActive ? '#fef2f2' : 'white',
                          color: isActive ? 'var(--primary-color)' : 'inherit',
                          cursor: 'pointer',
                          fontWeight: 'bold',
                          ...tool.style,
                        }}
                      >
                        {tool.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    title="Insert image between paragraphs"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      setShowInlineImagePicker(true);
                    }}
                    style={{ padding: '0 10px', height: '32px', border: '1px solid var(--primary-color)', borderRadius: '4px', background: '#fef2f2', cursor: 'pointer', fontWeight: 'bold', color: 'var(--primary-color)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    📷 Insert Image
                  </button>
                  <span style={{ fontSize: '0.75rem', color: '#9ca3af', marginLeft: '0.5rem' }}>Place cursor where you want the image, then click Insert Image</span>
                </div>
                <style dangerouslySetInnerHTML={{__html: `
                  .rich-editor:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    cursor: text;
                  }
                  .rich-editor blockquote {
                    border-left: 4px solid #e50914;
                    padding: 0.5rem 1rem;
                    margin: 1rem 0;
                    background: #fef2f2;
                    font-style: italic;
                  }
                  .rich-editor h2 {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin: 1rem 0 0.5rem 0;
                  }
                  .rich-editor h3 {
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin: 1rem 0 0.5rem 0;
                  }
                `}} />
                <div
                  ref={editorRef}
                  className="rich-editor"
                  contentEditable
                  data-placeholder="Write the article content here"
                  onInput={handleEditorInput}
                  onSelect={updateActiveFormats}
                  onKeyUp={updateActiveFormats}
                  onMouseUp={updateActiveFormats}
                  style={{
                    width: '100%',
                    minHeight: '400px',
                    padding: '1rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: 'white',
                    overflowY: 'auto',
                  }}
                ></div>
              </div>
            ) : (
              <div style={{ padding: '2rem', minHeight: '400px' }}>
                {content ? (
                  <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>{headline || 'Untitled'}</h1>
                    <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#374151' }} dangerouslySetInnerHTML={{ __html: content.includes('<') ? content : `<p>${content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>` }} />
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
      {showInlineImagePicker && (
        <MediaPicker
          onSelect={(url) => { insertInlineImage(url); setShowInlineImagePicker(false); }}
          onClose={() => setShowInlineImagePicker(false)}
        />
      )}
    </div>
  );
}
