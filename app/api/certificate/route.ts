import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function normalizeCertificatePath(value: string) {
  try {
    const raw = decodeURIComponent(value).trim()
    if (!raw) return ''

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

export async function GET(request: Request) {
  const url = new URL(request.url)
  const requestedPath = normalizeCertificatePath(url.searchParams.get('path') || '')

  if (!requestedPath) {
    return NextResponse.json({ error: 'Invalid certificate file.' }, { status: 400 })
  }

  const supabase = await createClient()
  let path = requestedPath

  // A certificate can be re-uploaded from the admin panel, which changes its
  // UUID-prefixed storage path. Browsers can still hold an older link in cache.
  // Resolve that stale path by its stable filename before building the public URL.
  const filename = requestedPath.split('/').pop() || requestedPath
  const { data: matchingCertificates } = await supabase
    .from('certificates')
    .select('certificate_pdf, active')
    .eq('active', true)

  const exactMatch = matchingCertificates?.find((row) =>
    normalizeCertificatePath(row.certificate_pdf || '') === requestedPath
  )

  if (!exactMatch) {
    const filenameMatch = matchingCertificates?.find((row) => {
      const candidate = normalizeCertificatePath(row.certificate_pdf || '')
      return candidate.split('/').pop() === filename
    })
    if (filenameMatch?.certificate_pdf) {
      path = normalizeCertificatePath(filenameMatch.certificate_pdf)
    }
  }

  const { data: publicData } = supabase.storage.from('certificates').getPublicUrl(path)
  if (!publicData?.publicUrl) {
    return NextResponse.json({ error: 'Unable to open certificate.' }, { status: 500 })
  }

  // Certificates are portfolio content, so serve them through Supabase's public
  // object endpoint just like the working resume viewer. This avoids browser/
  // mobile iframe issues caused by proxying signed PDFs through a server route.
  const download = url.searchParams.get('download') === '1'
  if (!download) return NextResponse.redirect(publicData.publicUrl)

  const response = await fetch(publicData.publicUrl, { cache: 'no-store' })
  if (!response.ok) {
    return NextResponse.json({ error: 'Unable to download certificate PDF.' }, { status: 502 })
  }

  const body = await response.arrayBuffer()
  const outputFilename = path.split('/').pop()?.replace(/[^a-zA-Z0-9._-]/g, '-') || 'certificate.pdf'
  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${outputFilename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
