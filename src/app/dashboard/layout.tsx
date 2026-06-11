'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#111827', color: 'white', padding: '2rem 1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: 'var(--primary-color)' }}>News CMS</h2>
        <nav>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li><Link href="/dashboard" style={{ display: 'block', padding: '0.75rem 1rem', borderRadius: '4px', backgroundColor: '#374151' }}>Overview</Link></li>
            <li><Link href="/dashboard/articles" style={{ display: 'block', padding: '0.75rem 1rem', borderRadius: '4px' }}>Articles</Link></li>
            <li><Link href="/dashboard/categories" style={{ display: 'block', padding: '0.75rem 1rem', borderRadius: '4px' }}>Categories</Link></li>
            <li><Link href="/dashboard/media" style={{ display: 'block', padding: '0.75rem 1rem', borderRadius: '4px' }}>Media</Link></li>
            <li><Link href="/" style={{ display: 'block', padding: '0.75rem 1rem', borderRadius: '4px', marginTop: '2rem', color: '#9ca3af' }}>← View Site</Link></li>
            <li>
              <button
                onClick={logout}
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

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
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
