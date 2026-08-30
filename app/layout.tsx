import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://owaies-portfolio.vercel.app'),
  title: 'Mohammed Owaies | AI/ML Engineer',
  description: 'AI/ML Engineer portfolio of Mohammed Owaies, focused on machine learning, computer vision, algorithms, and real-world software systems.',
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
