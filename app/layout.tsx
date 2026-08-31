import type { Metadata } from 'next'
import './globals.css'
import './admin-overrides.css'
import './premium-ux.css'
import './premium-ux-motion.css'
import './profile-palette-motion.css'
import './site-nav.css'
import SiteNav from './site-nav'
import PremiumUX from './premium-ux'

const siteUrl = 'https://owaies-portfolio.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Mohammed Owaies | AI/ML Engineer',
  description: 'AI/ML Engineer portfolio of Mohammed Owaies, focused on machine learning, computer vision, algorithms, and real-world software systems.',
  authors: [{ name: 'Mohammed Owaies' }],
  creator: 'Mohammed Owaies',
  keywords: ['Mohammed Owaies', 'AI/ML Engineer', 'Machine Learning', 'Computer Vision', 'Python', 'Portfolio'],
  robots: { index: true, follow: true },
  icons: { icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }], shortcut: ['/favicon.svg'], apple: [{ url: '/apple-touch-icon.svg', type: 'image/svg+xml' }] },
  alternates: { canonical: '/' },
  openGraph: { title: 'Mohammed Owaies | AI/ML Engineer', description: 'Building intelligent, practical systems with AI/ML and software engineering.', type: 'website', url: siteUrl, siteName: 'Mohammed Owaies Portfolio', images: [{ url: '/og-image.svg', width: 1200, height: 630, alt: 'Mohammed Owaies AI/ML Engineer portfolio' }] },
  twitter: { card: 'summary_large_image', title: 'Mohammed Owaies | AI/ML Engineer', description: 'AI/ML Engineer portfolio focused on intelligent real-world systems.', images: ['/og-image.svg'] },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><SiteNav /><PremiumUX>{children}</PremiumUX></body></html>
}
