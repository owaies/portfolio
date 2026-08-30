import type { Metadata } from 'next'
import './globals.css'
import { PROFILE_IMAGE_DATA_URL } from '@/lib/profile-image'

export const metadata: Metadata = {
  metadataBase: new URL('https://owaies-portfolio.vercel.app'),
  title: 'Mohammed Owaies | AI/ML Engineer',
  description: 'AI/ML Engineer portfolio of Mohammed Owaies, focused on machine learning, computer vision, algorithms, and real-world software systems.',
  icons: {
    icon: PROFILE_IMAGE_DATA_URL,
    shortcut: PROFILE_IMAGE_DATA_URL,
    apple: PROFILE_IMAGE_DATA_URL,
  },
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Mohammed Owaies | AI/ML Engineer',
    description: 'Building intelligent, practical systems with AI/ML and software engineering.',
    type: 'website',
    url: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammed Owaies | AI/ML Engineer',
    description: 'AI/ML Engineer portfolio.',
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
