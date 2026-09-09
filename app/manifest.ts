import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Mohammed Owaies | AI/ML Engineer',
    short_name: 'Owaies Portfolio',
    description: 'AI/ML Engineer portfolio focused on machine learning, computer vision, and practical software systems.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0807',
    theme_color: '#0a0807',
    lang: 'en',
    icons: [
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  }
}
