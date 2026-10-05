import Link from 'next/link';

export default function NotFound() {
  return (
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
          fontSize: '6rem',
          fontWeight: '900',
          color: '#dc2626',
          marginBottom: '0.5rem',
          lineHeight: '1',
        }}
      >
        404
      </h1>
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: '1rem',
        }}
      >
        पेज नहीं मिला
      </h2>
      <p
        style={{
          fontSize: '1.05rem',
          color: '#6b7280',
          marginBottom: '2rem',
          maxWidth: '500px',
        }}
      >
        जो पेज आप ढूंढ रहे हैं वह मौजूद नहीं है या हटा दिया गया है।
      </p>
      <Link
        href="/"
        style={{
          padding: '0.75rem 2rem',
          backgroundColor: '#dc2626',
          color: 'white',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          textDecoration: 'none',
        }}
      >
        होमपेज पर जाएं
      </Link>
    </div>
  );
}
