'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
  const { user, isLoading, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [breakingNews, setBreakingNews] = useState<string>('Loading breaking news...');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchBreaking() {
      try {
        const res = await fetch('/api/articles?limit=3');
        const data = await res.json();
        if (data.articles && data.articles.length > 0) {
          const newsStr = data.articles.map((a: any) => a.title).join(' || ');
          setBreakingNews(newsStr + ' || ');
        } else {
          setBreakingNews('No breaking news at the moment.');
        }
      } catch (err) {
        setBreakingNews('Failed to load breaking news.');
      }
    }
    fetchBreaking();
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
        <Link href="/">
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--primary-color)', letterSpacing: '-1px', margin: 0 }}>LIVE NEWS</h1>
        </Link>

        {/* Desktop actions */}
        <div className="header-actions hide-mobile">
          <input 
            type="text" 
            placeholder="Search news..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            style={{ padding: '0.5rem 1rem', borderRadius: '20px', border: '1px solid var(--border-color)', outline: 'none' }} 
          />

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
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary-color)' }}>LIVE NEWS</h2>
          <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.75rem', cursor: 'pointer', color: 'var(--text-dark)' }}>✕</button>
        </div>

        {/* Mobile search */}
        <input 
          type="text" 
          placeholder="Search news..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', outline: 'none', marginBottom: '1.5rem', fontSize: '1rem', boxSizing: 'border-box' }} 
        />

        {/* Mobile nav links */}
        <nav>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {[
              { href: '/', label: 'Home' },
              { href: '/category/national', label: 'National' },
              { href: '/category/crime', label: 'Crime' },
              { href: '/category/sports', label: 'Sports' },
              { href: '/category/education', label: 'Education' },
              { href: '/category/political', label: 'Political' },
              { href: '/category/religious', label: 'Religious' },
              { href: '/category/social', label: 'Social' },
            ].map(link => (
              <li key={link.href}>
                <Link href={link.href} onClick={() => setMobileMenuOpen(false)} style={{ display: 'block', padding: '0.75rem 0', fontSize: '1.1rem', fontWeight: '600', borderBottom: '1px solid var(--border-color)' }}>
                  {link.label}
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
      </div>

      {/* Category Navigation */}
      <nav className="header-nav" style={{ borderTop: '1px solid #f3f4f6' }}>
        <ul>
          <li><Link href="/" style={{ color: 'var(--primary-color)' }}>Home</Link></li>
          <li><Link href="/category/national">National</Link></li>
          <li><Link href="/category/crime">Crime</Link></li>
          <li><Link href="/category/sports">Sports</Link></li>
          <li><Link href="/category/education">Education</Link></li>
          <li><Link href="/category/political">Political</Link></li>
          <li><Link href="/category/religious">Religious</Link></li>
          <li><Link href="/category/social">Social</Link></li>
        </ul>
      </nav>
    </header>
  );
}
