'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Youtube, Facebook, Linkedin } from 'lucide-react';
import XIcon from './XIcon';

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
                <Youtube size={18} />
              </a>
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
                <Facebook size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="LinkedIn"
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
                  e.currentTarget.style.backgroundColor = '#0077b5';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Linkedin size={18} />
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
                <XIcon size={18} />
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
