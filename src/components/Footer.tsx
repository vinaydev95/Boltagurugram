'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.categories) {
          // Limit to first 7 categories to keep footer clean
          setCategories(data.categories.slice(0, 7));
        }
      } catch (err) {
        console.error('Failed to fetch categories for footer:', err);
      }
    }
    fetchCategories();
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 5000);
  };

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      color: '#cbd5e1',
      padding: '4.5rem 1.5rem 2rem 1.5rem',
      marginTop: '5rem',
      borderTop: '4px solid var(--primary-color)',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div className="footer-grid">
        
        {/* About Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Link href="/" style={{ display: 'inline-block' }}>
            <img 
              src="/logo.gif" 
              alt="Bolta Gurugram Logo" 
              style={{ height: '80px', objectFit: 'contain', display: 'block' }} 
            />
          </Link>
          <p style={{ 
            color: '#94a3b8', 
            fontSize: '0.925rem', 
            lineHeight: '1.65', 
            margin: 0 
          }}>
            Your trusted source for breaking news, analysis, exclusive interviews, headlines, and videos at Bolta Gurugram.
          </p>
        </div>

        {/* Categories Section (Dynamic) */}
        <div>
          <h3 style={{ 
            fontSize: '1.05rem', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            color: '#f8fafc', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(229, 9, 20, 0.3)',
            paddingBottom: '0.5rem',
            display: 'inline-block'
          }}>
            Categories
          </h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.75rem', 
            fontSize: '0.9rem' 
          }}>
            {categories.length > 0 ? (
              categories.map(cat => (
                <li key={cat.id}>
                  <Link 
                    href={`/category/${cat.slug}`} 
                    className="footer-link"
                    style={{ 
                      color: '#94a3b8', 
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      display: 'inline-block'
                    }}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))
            ) : (
              <>
                <li><Link href="/category/national" className="footer-link" style={{ color: '#94a3b8', textDecoration: 'none' }}>National</Link></li>
                <li><Link href="/category/crime" className="footer-link" style={{ color: '#94a3b8', textDecoration: 'none' }}>Crime</Link></li>
                <li><Link href="/category/sports" className="footer-link" style={{ color: '#94a3b8', textDecoration: 'none' }}>Sports</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Pages Section */}
        <div>
          <h3 style={{ 
            fontSize: '1.05rem', 
            fontWeight: '700', 
            textTransform: 'uppercase', 
            letterSpacing: '1px', 
            color: '#f8fafc', 
            marginBottom: '1.5rem',
            borderBottom: '2px solid rgba(229, 9, 20, 0.3)',
            paddingBottom: '0.5rem',
            display: 'inline-block'
          }}>
            Company
          </h3>
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.75rem', 
            fontSize: '0.9rem' 
          }}>
            <li>
              <Link 
                href="/about" 
                className="footer-link"
                style={{ 
                  color: '#94a3b8', 
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  display: 'inline-block'
                }}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link 
                href="/contact" 
                className="footer-link"
                style={{ 
                  color: '#94a3b8', 
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  display: 'inline-block'
                }}
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link 
                href="/privacy-policy" 
                className="footer-link"
                style={{ 
                  color: '#94a3b8', 
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  display: 'inline-block'
                }}
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter & Socials Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ 
              fontSize: '1.05rem', 
              fontWeight: '700', 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              color: '#f8fafc', 
              marginBottom: '1.25rem',
              borderBottom: '2px solid rgba(229, 9, 20, 0.3)',
              paddingBottom: '0.5rem',
              display: 'inline-block'
            }}>
              Follow Us
            </h3>
            
            {/* Social Media Links with Brand Color Transition */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
              <a 
                href="https://www.facebook.com/share/1D3Z7etPtB/" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Facebook"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#1877F2';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </a>
              <a 
                href="https://x.com/BoltaGurugram" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Twitter/X"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#000000';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg fill="currentColor" viewBox="0 0 24 24" width="16" height="16">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/boltagurugram?utm_source=qr&igsh=cXhtYmt2ZGx2MG5m" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Instagram"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#E1306C';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com/@boltagurugram?si=3svBMOKcdBsMfoeT" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="YouTube"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease-in-out',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#FF0000';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <svg fill="currentColor" viewBox="0 0 24 24" width="18" height="18">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.022 0 12 0 12s0 3.978.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.858.508 9.388.508 9.388.508s7.53 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.978 24 12 24 12s0-3.978-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Newsletter Box */}
          <div>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '0 0 0.75rem 0' }}>
              Subscribe to our newsletter for daily updates.
            </p>
            {subscribed ? (
              <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 'bold', padding: '0.5rem 0' }}>
                ✓ Subscribed successfully!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} style={{ display: 'flex', maxWidth: '320px' }}>
                <input 
                  type="email" 
                  required
                  placeholder="Your email..." 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ 
                    padding: '0.65rem 0.9rem', 
                    borderRadius: '6px 0 0 6px', 
                    border: '1px solid rgba(255, 255, 255, 0.1)', 
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#f8fafc',
                    outline: 'none', 
                    width: '100%',
                    fontSize: '0.875rem'
                  }} 
                />
                <button 
                  type="submit"
                  style={{ 
                    backgroundColor: 'var(--primary-color)', 
                    color: 'white', 
                    border: 'none', 
                    padding: '0.65rem 1.25rem', 
                    borderRadius: '0 6px 6px 0', 
                    fontWeight: 'bold', 
                    cursor: 'pointer', 
                    flexShrink: 0,
                    fontSize: '0.875rem',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c2070f'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--primary-color)'}
                >
                  Join
                </button>
              </form>
            )}
          </div>
        </div>

      </div>

      {/* Copyright Bar */}
      <div style={{ 
        maxWidth: '1200px', 
        margin: '3rem auto 0 auto', 
        textAlign: 'center', 
        color: '#64748b', 
        fontSize: '0.825rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '1.75rem'
      }}>
        &copy; {new Date().getFullYear()} Bolta Gurugram. All rights reserved.
      </div>

      {/* Styling for animated link shifts */}
      <style jsx global>{`
        .footer-link:hover {
          color: var(--primary-color) !important;
          transform: translateX(5px);
        }
      `}</style>
    </footer>
  );
}
