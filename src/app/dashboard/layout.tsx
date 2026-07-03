'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || '';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/signin');
      } else if (user.role !== 'admin' && (pathname.startsWith('/dashboard/reporters') || pathname.startsWith('/dashboard/categories'))) {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, pathname, router]);

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111827',
        color: 'white',
        fontSize: '1.2rem',
      }}>
        Loading...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="dashboard-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)} 
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 200 }} 
        />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', color: 'var(--primary-color)', flex: 1 }}>News CMS</h2>
          {/* Close button visible only on mobile via inline media check */}
          <button 
            className="show-mobile" 
            onClick={() => setSidebarOpen(false)} 
            style={{ background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
        <nav>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li>
              <Link 
                href="/dashboard" 
                onClick={() => setSidebarOpen(false)} 
                style={{ 
                  display: 'block', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '4px', 
                  backgroundColor: isActive('/dashboard') ? '#374151' : 'transparent',
                  color: 'white'
                }}
              >
                Overview
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboard/articles" 
                onClick={() => setSidebarOpen(false)} 
                style={{ 
                  display: 'block', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '4px',
                  backgroundColor: isActive('/dashboard/articles') ? '#374151' : 'transparent',
                  color: 'white'
                }}
              >
                Articles
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li>
                <Link 
                  href="/dashboard/categories" 
                  onClick={() => setSidebarOpen(false)} 
                  style={{ 
                    display: 'block', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '4px',
                    backgroundColor: isActive('/dashboard/categories') ? '#374151' : 'transparent',
                    color: 'white'
                  }}
                >
                  Categories
                </Link>
              </li>
            )}
            <li>
              <Link 
                href="/dashboard/media" 
                onClick={() => setSidebarOpen(false)} 
                style={{ 
                  display: 'block', 
                  padding: '0.75rem 1rem', 
                  borderRadius: '4px',
                  backgroundColor: isActive('/dashboard/media') ? '#374151' : 'transparent',
                  color: 'white'
                }}
              >
                Media
              </Link>
            </li>
            {user?.role === 'admin' && (
              <li>
                <Link 
                  href="/dashboard/reporters" 
                  onClick={() => setSidebarOpen(false)} 
                  style={{ 
                    display: 'block', 
                    padding: '0.75rem 1rem', 
                    borderRadius: '4px',
                    backgroundColor: isActive('/dashboard/reporters') ? '#374151' : 'transparent',
                    color: 'white'
                  }}
                >
                  Reporters
                </Link>
              </li>
            )}
            <li><Link href="/" onClick={() => setSidebarOpen(false)} style={{ display: 'block', padding: '0.75rem 1rem', borderRadius: '4px', marginTop: '2rem', color: '#9ca3af' }}>← View Site</Link></li>
            <li>
              <button
                onClick={() => { logout(); setSidebarOpen(false); }}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '4px',
                  backgroundColor: 'transparent',
                  border: '1px solid #374151',
                  color: '#ef4444',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: 'inherit',
                  fontFamily: 'inherit',
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile sidebar toggle button */}
      <button className="dashboard-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', minWidth: 0 }}>
        <header style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>{user.name} ({user.role})</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}
