import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function normalizeCertificatePath(value: string) {
  try {
    const raw = decodeURIComponent(value).trim()
    if (!raw) return ''

    // Accept the stored object path directly, with or without the bucket prefix.
    if (!raw.includes('://')) {
      const normalized = raw.replace(/^\/+/, '')
      const objectPath = normalized.startsWith('certificates/')
        ? normalized.slice('certificates/'.length)
        : normalized
      return objectPath && !objectPath.includes('..') ? objectPath : ''
    }

    const parsed = new URL(raw)
    const marker = '/storage/v1/object/'
    const markerIndex = parsed.pathname.indexOf(marker)
    if (markerIndex === -1) return ''

    const parts = parsed.pathname
      .slice(markerIndex + marker.length)
      .split('/')
      .filter(Boolean)

    const bucketIndex = parts.findIndex((part) => part === 'certificates')
    if (bucketIndex === -1) return ''

    const objectPath = parts.slice(bucketIndex + 1).join('/')
    return objectPath && !objectPath.includes('..') ? objectPath : ''
  } catch {
    return ''
  }
}

async function getCertificateResponse(path: string, download: boolean) {
  const supabase = await createClient()
  const { data, error } = await supabase.storage.from('certificates').createSignedUrl(path, 300)

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: 'Certificate file is unavailable. Please replace the PDF from Admin → Certificates.' },
      { status: 404 },
    )
  }

  // Proxy the signed object instead of redirecting to Supabase. This guarantees
  // that mobile browsers receive an actual application/pdf response and lets
  // the custom viewer render the certificate reliably inside its iframe.
  const response = await fetch(data.signedUrl, { cache: 'no-store' })
  if (!response.ok) {
    return NextResponse.json({ error: 'Unable to load certificate PDF.' }, { status: 502 })
  }

  const body = await response.arrayBuffer()
  const filename = path.split('/').pop()?.replace(/[^a-zA-Z0-9._-]/g, '-') || 'certificate.pdf'

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${filename}"`,
      'Cache-Control': 'private, no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const path = normalizeCertificatePath(url.searchParams.get('path') || '')

  if (!path) {
    return NextResponse.json({ error: 'Invalid certificate file.' }, { status: 400 })
  }

  return getCertificateResponse(path, url.searchParams.get('download') === '1')
}
