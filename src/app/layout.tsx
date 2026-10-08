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
    locale: 'en_US',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <head>
        {/* Google AdSense Script */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
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
