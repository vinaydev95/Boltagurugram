'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Search, Youtube, Facebook, Linkedin } from 'lucide-react';
import XIcon from './XIcon';

interface Category {
  id: number;
  name: string;
  slug: string;
  color?: string;
}

let globalCategories: Category[] | null = null;
let globalBreaking: string | null = null;

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [breakingNews, setBreakingNews] = useState<string>(globalBreaking || 'Loading breaking news...');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(globalCategories || []);
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith('/category/')) {
      setActiveCategorySlug(pathname.split('/')[2]);
    } else if (pathname.startsWith('/article/')) {
      const slug = pathname.split('/')[2];
      fetch(`/api/articles/${slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.article && data.article.category_slug) {
            setActiveCategorySlug(data.article.category_slug);
          }
        })
        .catch(err => console.error('Failed to fetch article category for header', err));
    } else {
      setActiveCategorySlug(null);
    }
  }, [pathname]);

  useEffect(() => {
    async function fetchBreaking() {
      try {
        const res = await fetch('/api/articles?limit=3');
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          const newsStr = data.articles.map((a: any) => a.title).join(' || ');
          globalBreaking = newsStr + ' || ';
          setBreakingNews(globalBreaking);
        } else {
          setBreakingNews('No breaking news at the moment.');
        }
      } catch (err) {
        setBreakingNews('Failed to load breaking news.');
      }
    }
    fetchBreaking();
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (data.categories) {
          globalCategories = data.categories;
          setCategories(data.categories);
        }
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    }
    fetchCategories();
  }, []);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header style={{ backgroundColor: 'white', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top Bar - Breaking News Ticker */}
      <div style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          <span style={{ fontWeight: 'bold', backgroundColor: 'white', color: 'var(--primary-color)', padding: '0.2rem 0.5rem', borderRadius: '3px', marginRight: '1rem', textTransform: 'uppercase', letterSpacing: '0.5px', flexShrink: 0 }}>Breaking</span>
          {/* @ts-ignore */}
          <marquee style={{ flex: 1 }}>
            {breakingNews}
          {/* @ts-ignore */}
          </marquee>
        </div>
      </div>

      {/* Main Header */}
      <div className="header-main">
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/logo.png" alt="Bolta Gurugram Logo" style={{ height: '100px', objectFit: 'contain' }} />
        </Link>

        {/* Desktop actions */}
        <div className="header-actions hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search style={{ position: 'absolute', left: '0.75rem', color: '#9ca3af', width: '1rem', height: '1rem', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search news..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              style={{ padding: '0.5rem 1rem 0.5rem 2.5rem', borderRadius: '20px', border: '1px solid var(--border-color)', outline: 'none' }}
            />
          </div>

          {isLoading ? (
            <span style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', color: '#9ca3af' }}>...</span>
          ) : user ? (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <Link
                href="/dashboard"
                id="header-dashboard-btn"
                style={{
                  backgroundColor: 'var(--text-dark)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                }}
              >
                Dashboard
              </Link>
              <button
                id="header-logout-btn"
                onClick={logout}
                style={{
                  backgroundColor: 'transparent',
                  color: '#dc2626',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  fontSize: '0.85rem',
                  fontWeight: '600',
                  border: '1px solid #fecaca',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#fef2f2'; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              id="header-signin-btn"
              style={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                padding: '0.5rem 1.25rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                transition: 'opacity 0.2s',
              }}
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile hamburger button */}
        <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu">
          ☰
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <img src="/logo.png" alt="Bolta Gurugram Logo" style={{ height: '35px', objectFit: 'contain' }} />
          <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: 'var(--text-dark)' }}>✕</button>
        </div>

        {/* Mobile search */}
        <div style={{ position: 'relative', marginBottom: '1.5rem', display: 'flex', alignItems: 'center' }}>
          <Search style={{ position: 'absolute', left: '1rem', color: '#9ca3af', width: '1.25rem', height: '1.25rem', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
          />
        </div>

        {/* Mobile nav links - dynamic from DB */}
        <nav>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <li>
              <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '0.75rem 0', fontSize: '1.1rem', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                Latest News
              </Link>
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <Link href={`/category/${cat.slug}`} onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '0.75rem 0', fontSize: '1.1rem', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile auth */}
        <div style={{ marginTop: '1.5rem' }}>
          {isLoading ? null : user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', textAlign: 'center', backgroundColor: 'var(--text-dark)', color: 'white', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold' }}>
                Dashboard
              </Link>
              <button onClick={() => { logout(); setMobileMenuOpen(false); }} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #fecaca', backgroundColor: '#fef2f2', color: '#dc2626', fontWeight: '600', cursor: 'pointer', fontSize: '1rem' }}>
                Logout
              </button>
            </div>
          ) : (
            <Link href="/signin" onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', textAlign: 'center', backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.75rem', borderRadius: '8px', fontWeight: 'bold' }}>
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Social Links */}
        <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
          <a href="https://youtube.com/@boltagurugram?si=3svBMOKcdBsMfoeT" target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280' }} aria-label="YouTube">
            <Youtube size={24} />
          </a>
          <a href="https://www.facebook.com/share/1D3Z7etPtB/" target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280' }} aria-label="Facebook">
            <Facebook size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280' }} aria-label="LinkedIn">
            <Linkedin size={24} />
          </a>
          <a href="https://x.com/BoltaGurugram" target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280' }} aria-label="X / Twitter">
            <XIcon size={24} />
          </a>
        </div>
      </div>

      {/* Category Navigation - dynamic from DB */}
      <nav className="header-nav" style={{ borderTop: '1px solid #f3f4f6', backgroundColor: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center' }}>
          
          <ul style={{ flex: 1, margin: 0, maxWidth: 'none', paddingRight: '1rem' }}>
            <li>
              <Link 
                href="/" 
                style={{ 
                  color: pathname === '/' ? 'var(--primary-color)' : 'var(--text-dark)',
                  fontWeight: pathname === '/' ? 'bold' : 'normal',
                  borderBottom: pathname === '/' ? '2px solid var(--primary-color)' : 'none',
                  paddingBottom: '1.25rem'
                }}
              >
                Latest News
              </Link>
            </li>
            {categories.map(cat => {
              const isActive = activeCategorySlug === cat.slug;
              return (
                <li key={cat.id}>
                  <Link 
                    href={`/category/${cat.slug}`}
                    style={{ 
                      color: isActive ? 'var(--primary-color)' : 'var(--text-dark)',
                      fontWeight: isActive ? 'bold' : 'normal',
                      borderBottom: isActive ? '2px solid var(--primary-color)' : 'none',
                      paddingBottom: '1.25rem'
                    }}
                  >
                    {cat.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Social Links on the Right (Desktop only) */}
          <div className="hide-mobile" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', padding: '0 1rem', borderLeft: '1px solid var(--border-color)', height: '100%' }}>
            <a href="https://youtube.com/@boltagurugram?si=3svBMOKcdBsMfoeT" target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#ef4444'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'} aria-label="YouTube">
              <Youtube size={18} />
            </a>
            <a href="https://www.facebook.com/share/1D3Z7etPtB/" target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#3b5998'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'} aria-label="Facebook">
              <Facebook size={18} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#0077b5'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'} aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href="https://x.com/BoltaGurugram" target="_blank" rel="noopener noreferrer" style={{ color: '#6b7280', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = '#1da1f2'} onMouseOut={(e) => e.currentTarget.style.color = '#6b7280'} aria-label="X / Twitter">
              <XIcon size={18} />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
