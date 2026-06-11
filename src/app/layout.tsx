import './globals.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/AuthContext'

export const metadata: Metadata = {
  title: 'News Portal | Latest News, Breaking News',
  description: 'Your reliable source for the latest news and updates.',
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
