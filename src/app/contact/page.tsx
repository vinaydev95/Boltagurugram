'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate sending email/message to boltagurugram@gmail.com
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <main style={{ maxWidth: '1100px', margin: '3rem auto', padding: '0 1.5rem', flex: 1, width: '100%', boxSizing: 'border-box' }}>
        
        {/* Page Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '0.35rem 1rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Get in Touch
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--text-dark)', marginTop: '1rem', marginBottom: '0.5rem' }}>
            Contact Us
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.1rem', margin: 0 }}>
            संपर्क करें | Have a news tip, feedback, or business inquiry? Reach out to Bolta Gurugram.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Column 1: Contact Information */}
          <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Contact Information
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontSize: '1.05rem', marginTop: '1rem' }}>
              
              {/* Email */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', backgroundColor: '#fef2f2', padding: '0.5rem', borderRadius: '8px', lineHeight: '1' }}>📧</span>
                <div>
                  <h4 style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--text-dark)' }}>Email Us</h4>
                  <a href="mailto:boltagurugram@gmail.com" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>
                    boltagurugram@gmail.com
                  </a>
                </div>
              </div>

              {/* Location */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', backgroundColor: '#fef2f2', padding: '0.5rem', borderRadius: '8px', lineHeight: '1' }}>📍</span>
                <div>
                  <h4 style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--text-dark)' }}>Our Location</h4>
                  <p style={{ margin: 0, color: '#4b5563' }}>Gurugram, Haryana, India</p>
                </div>
              </div>

              {/* Website */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', backgroundColor: '#fef2f2', padding: '0.5rem', borderRadius: '8px', lineHeight: '1' }}>🌐</span>
                <div>
                  <h4 style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--text-dark)' }}>Website</h4>
                  <a href="https://www.boltagurugram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>
                    www.boltagurugram.com
                  </a>
                </div>
              </div>

              {/* WhatsApp News Tips */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem', backgroundColor: '#fef2f2', padding: '0.5rem', borderRadius: '8px', lineHeight: '1' }}>📱</span>
                <div>
                  <h4 style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', color: 'var(--text-dark)' }}>WhatsApp News Tips</h4>
                  <p style={{ margin: '0 0 0.75rem 0', color: '#4b5563', fontSize: '0.9rem' }}>
                    Share hot news, photos, or video updates directly with our editorial room:
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <a href="https://wa.me/919899345464" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#25D366', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Send Tip 1</a>
                    <a href="https://wa.me/918010878256" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#25D366', color: 'white', padding: '0.4rem 0.8rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.85rem' }}>Send Tip 2</a>
                  </div>
                </div>
              </div>

            </div>

            {/* Social Channels */}
            <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #f3f4f6' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1rem' }}>
                Follow Our Network
              </h3>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <a href="https://www.facebook.com/share/1D3Z7etPtB/" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#1877F2', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>Facebook</a>
                <a href="https://www.instagram.com/boltagurugram?utm_source=qr&igsh=cXhtYmt2ZGx2MG5m" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#E1306C', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>Instagram</a>
                <a href="https://x.com/BoltaGurugram" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#000000', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>Twitter / X</a>
                <a href="https://youtube.com/@boltagurugram?si=3svBMOKcdBsMfoeT" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#FF0000', color: 'white', padding: '0.5rem 1rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.8rem' }}>YouTube</a>
              </div>
            </div>

          </div>

          {/* Column 2: Contact Form */}
          <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-dark)', marginBottom: '1.5rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Send Us a Message
            </h2>
            
            {success ? (
              <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', padding: '1.5rem', borderRadius: '8px', textAlign: 'center', marginTop: '1rem' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>✓</span>
                <h4 style={{ fontWeight: 'bold', margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Thank You!</h4>
                <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: '1.5' }}>
                  Your message has been sent successfully. We will get back to you shortly at your email address.
                </p>
                <button onClick={() => setSuccess(false)} style={{ marginTop: '1.5rem', padding: '0.5rem 1.5rem', borderRadius: '6px', border: 'none', backgroundColor: '#059669', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                
                {/* Name */}
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#374151' }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#374151' }}>Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Subject */}
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#374151' }}>Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="Feedback, news submission, advertisement..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', fontSize: '0.95rem', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Message */}
                <div>
                  <label style={{ display: 'block', fontWeight: '600', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#374151' }}>Message</label>
                  <textarea
                    required
                    rows={5}
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border-color)', borderRadius: '6px', outline: 'none', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    backgroundColor: submitting ? '#9ca3af' : 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    padding: '0.9rem',
                    borderRadius: '6px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: submitting ? 'not-allowed' : 'pointer',
                    boxShadow: '0 4px 6px rgba(229, 9, 20, 0.2)',
                    transition: 'opacity 0.2s',
                    marginTop: '0.5rem'
                  }}
                >
                  {submitting ? 'Sending Message...' : 'Send Message'}
                </button>

              </form>
            )}

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
