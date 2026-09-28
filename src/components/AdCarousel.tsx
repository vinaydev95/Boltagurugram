'use client';

import { useState, useEffect } from 'react';

export default function AdCarousel({ ads }: { ads: any[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (ads.length <= 1) return;

    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % ads.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [ads.length]);

  if (ads.length === 0) {
    return null;
  }

  const ad = ads[activeIndex];

  return (
    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', width: '100%', position: 'relative', overflow: 'hidden' }}>
      {ad.target_url ? (
        <a href={ad.target_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', textAlign: 'center' }}>
          <img 
            src={ad.image_url} 
            alt={ad.title} 
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '250px', objectFit: 'contain', borderRadius: '4px', transition: 'opacity 0.5s ease-in-out' }} 
          />
        </a>
      ) : (
        <div style={{ display: 'block', width: '100%', textAlign: 'center' }}>
          <img 
            src={ad.image_url} 
            alt={ad.title} 
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '250px', objectFit: 'contain', borderRadius: '4px', transition: 'opacity 0.5s ease-in-out' }} 
          />
        </div>
      )}
      
      {ads.length > 1 && (
        <div style={{ position: 'absolute', bottom: '10px', display: 'flex', gap: '5px', justifyContent: 'center', width: '100%' }}>
          {ads.map((_, i) => (
            <div 
              key={i} 
              style={{ 
                width: '8px', 
                height: '8px', 
                borderRadius: '50%', 
                backgroundColor: i === activeIndex ? 'var(--primary-color)' : 'rgba(0,0,0,0.3)',
                transition: 'background-color 0.3s'
              }} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
