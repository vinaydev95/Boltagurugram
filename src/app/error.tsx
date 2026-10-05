'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Page error:', error);
  }, [error]);

  return (
    <html lang="hi">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f9fafb',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <h1
            style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#1f2937',
              marginBottom: '1rem',
            }}
          >
            कुछ गलत हो गया
          </h1>
          <p
            style={{
              fontSize: '1.1rem',
              color: '#6b7280',
              marginBottom: '2rem',
              maxWidth: '500px',
            }}
          >
            पेज लोड करने में समस्या हुई। कृपया दोबारा कोशिश करें।
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            दोबारा कोशिश करें
          </button>
          <a
            href="/"
            style={{
              marginTop: '1rem',
              color: '#dc2626',
              textDecoration: 'underline',
              fontSize: '0.95rem',
            }}
          >
            होमपेज पर जाएं
          </a>
        </div>
      </body>
    </html>
  );
}
