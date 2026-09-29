import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { AuthProvider } from '@/lib/AuthContext'

export const metadata: Metadata = {
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
        url: 'https://boltagurugram.com/logo.gif',
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
    images: ['https://boltagurugram.com/logo.gif'],
  },
}

const adsenseClientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-3454649560719666'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense Script */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClientId}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
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
