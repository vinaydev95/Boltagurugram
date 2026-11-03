import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/AuthContext'

export const metadata: Metadata = {
  metadataBase: new URL('https://boltagurugram.com'),
  alternates: {
    canonical: 'https://boltagurugram.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'google-adsense-account': 'ca-pub-3454649560719666',
  },
  title: 'Bolta Gurugram | Latest News, Breaking News',
  description: 'Your reliable source for the latest news and updates from Gurugram.',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: 'Bolta Gurugram | Latest News, Breaking News',
    description: 'Your reliable source for the latest news and updates from Gurugram.',
    url: 'https://boltagurugram.com',
    siteName: 'Bolta Gurugram',
    images: [
      {
        url: 'https://boltagurugram.com/logo.png',
        width: 800,
        height: 600,
        alt: 'Bolta Gurugram',
      },
    ],
    locale: 'hi_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bolta Gurugram | Latest News, Breaking News',
    description: 'Your reliable source for the latest news and updates from Gurugram.',
    images: ['https://boltagurugram.com/logo.png'],
  },
}

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3454649560719666'

const organizationSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'NewsMediaOrganization',
      '@id': 'https://boltagurugram.com/#organization',
      name: 'Bolta Gurugram',
      url: 'https://boltagurugram.com',
      logo: {
        '@type': 'ImageObject',
        '@id': 'https://boltagurugram.com/#logo',
        url: 'https://boltagurugram.com/logo.png',
        caption: 'Bolta Gurugram',
      },
      image: 'https://boltagurugram.com/logo.png',
      description: 'गुरुग्राम और हरियाणा की सबसे विश्वसनीय डिजिटल हिंदी न्यूज़ वेबसाइट।',
      sameAs: [
        'https://youtube.com/@boltagurugram',
        'https://www.facebook.com/share/1D3Z7etPtB/',
        'https://x.com/BoltaGurugram',
        'https://whatsapp.com/channel/0029Va5hI9s47XeI8YoEeU11',
      ],
      publishingPrinciples: 'https://boltagurugram.com/editorial-policy',
      correctionsPolicy: 'https://boltagurugram.com/editorial-policy',
      ethicsPolicy: 'https://boltagurugram.com/editorial-policy',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+91-9899345464',
        contactType: 'editorial',
        email: 'boltagurugram@gmail.com',
        areaServed: 'IN',
        availableLanguage: ['Hindi', 'English'],
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Kamla Palace, Sohna Chowk',
        addressLocality: 'Gurugram',
        addressRegion: 'Haryana',
        postalCode: '122001',
        addressCountry: 'IN',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://boltagurugram.com/#website',
      url: 'https://boltagurugram.com',
      name: 'Bolta Gurugram',
      publisher: {
        '@id': 'https://boltagurugram.com/#organization',
      },
      inLanguage: 'hi-IN',
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://boltagurugram.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <head>
        {/* Google AdSense Script - Placed in head for raw HTML scrapers */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
        />
        {/* RSS Feed auto-discovery for Google News and RSS readers */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Bolta Gurugram News Feed"
          href="https://boltagurugram.com/feed.xml"
        />
        {/* NewsMediaOrganization & WebSite Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
