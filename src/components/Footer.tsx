import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#111827', color: 'white', padding: '4rem 1rem 2rem 1rem', marginTop: '4rem' }}>
      <div className="footer-grid">

        <div>
          <Link href="/"><h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary-color)', marginBottom: '1rem' }}>LIVE NEWS</h2></Link>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', lineHeight: '1.6' }}>Your trusted source for breaking news, analysis, exclusive interviews, headlines, and videos at Live News.</p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Categories</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#9ca3af', fontSize: '0.9rem' }}>
            <li><Link href="/category/national" style={{ color: '#9ca3af' }}>National</Link></li>
            <li><Link href="/category/crime" style={{ color: '#9ca3af' }}>Crime</Link></li>
            <li><Link href="/category/sports" style={{ color: '#9ca3af' }}>Sports</Link></li>
            <li><Link href="/category/education" style={{ color: '#9ca3af' }}>Education</Link></li>
            <li><Link href="/category/political" style={{ color: '#9ca3af' }}>Political</Link></li>
            <li><Link href="/category/religious" style={{ color: '#9ca3af' }}>Religious</Link></li>
            <li><Link href="/category/social" style={{ color: '#9ca3af' }}>Social</Link></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Company</h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: '#9ca3af', fontSize: '0.9rem' }}>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>Follow Us</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>FB</div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>TW</div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>IG</div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>YT</div>
          </div>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginTop: '1.5rem' }}>Subscribe to our newsletter for daily updates.</p>
          <div style={{ display: 'flex', marginTop: '0.5rem' }}>
            <input type="email" placeholder="Your email..." style={{ padding: '0.5rem', borderRadius: '4px 0 0 4px', border: 'none', outline: 'none', width: '100%' }} />
            <button style={{ backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0 4px 4px 0', fontWeight: 'bold', cursor: 'pointer', flexShrink: 0 }}>Subscribe</button>
          </div>
        </div>

      </div>
      <div style={{ maxWidth: '1200px', margin: '2rem auto 0 auto', textAlign: 'center', color: '#6b7280', fontSize: '0.85rem' }}>
        &copy; {new Date().getFullYear()} Live News Portal. All rights reserved.
      </div>
    </footer>
  );
}
