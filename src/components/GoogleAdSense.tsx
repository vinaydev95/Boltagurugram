'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdSenseProps {
  /** Your ad slot ID from AdSense dashboard (e.g. "1234567890") */
  adSlot: string;
  /** Ad format: 'auto', 'rectangle', 'horizontal', 'vertical' */
  adFormat?: string;
  /** Whether to use full-width responsive ads */
  fullWidthResponsive?: boolean;
  /** Custom style for the ad container */
  style?: React.CSSProperties;
  /** Layout key for in-feed/in-article ads */
  adLayoutKey?: string;
  /** Ad layout type: 'in-article', 'in-feed', or leave empty for display ads */
  adLayout?: string;
}

export default function GoogleAdSense({
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true,
  style,
  adLayoutKey,
  adLayout,
}: GoogleAdSenseProps) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div
      className="adsense-container"
      style={{
        textAlign: 'center',
        margin: '1.5rem 0',
        overflow: 'hidden',
        ...style,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3454649560719666'}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
        {...(adLayoutKey ? { 'data-ad-layout-key': adLayoutKey } : {})}
        {...(adLayout ? { 'data-ad-layout': adLayout } : {})}
      />
    </div>
  );
}
