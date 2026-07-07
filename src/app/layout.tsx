import './globals.css'
import type { Metadata } from 'next'
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
