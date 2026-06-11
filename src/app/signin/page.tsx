'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(email, password);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message || 'Invalid credentials');
    }
    setIsSubmitting(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #0f172a 100%)',
      padding: '1rem',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '3rem 2.5rem',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #e50914, #ff4757, #e50914)',
        }} />

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '900',
            color: '#e50914',
            letterSpacing: '-1px',
            marginBottom: '0.5rem',
          }}>LIVE NEWS</h1>
          <p style={{
            color: '#6b7280',
            fontSize: '0.95rem',
          }}>Admin Dashboard Login</p>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem',
            }}>Email Address</label>
            <input
              id="signin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@newsportal.com"
              required
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '2px solid #e5e7eb',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#e50914'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{
              display: 'block',
              fontSize: '0.85rem',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '0.5rem',
            }}>Password</label>
            <input
              id="signin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                borderRadius: '10px',
                border: '2px solid #e5e7eb',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#e50914'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button
            id="signin-submit"
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '0.9rem',
              backgroundColor: isSubmitting ? '#9ca3af' : '#e50914',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1rem',
              fontWeight: '700',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s, transform 0.1s',
              letterSpacing: '0.5px',
            }}
            onMouseOver={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#c2070f'; }}
            onMouseOut={(e) => { if (!isSubmitting) e.currentTarget.style.backgroundColor = '#e50914'; }}
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          marginTop: '2rem',
          fontSize: '0.8rem',
          color: '#9ca3af',
        }}>
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}
