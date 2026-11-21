import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us | Bolta Gurugram',
  description: 'Contact the Bolta Gurugram editorial team with news tips, feedback, corrections, or advertising inquiries.',
  alternates: { canonical: '/contact' },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
