import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

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

function certificateFilename(path: string) {
  const filename = path.split('/').pop() || path
  return filename.replace(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}-/i,
    '',
  )
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')?.trim() || ''
  const requestedPath = normalizeCertificatePath(url.searchParams.get('path') || '')
  const supabase = await createClient()

  let path = requestedPath

  // Prefer the certificate ID. This always resolves to the latest database
  // record and prevents stale browser pages from pointing at deleted uploads.
  if (id) {
    const { data } = await supabase
      .from('certificates')
      .select('certificate_pdf,title')
      .eq('id', id)
      .eq('active', true)
      .maybeSingle()

    if (data?.certificate_pdf) {
      path = normalizeCertificatePath(data.certificate_pdf)
    }
  }

  if (!path) {
    if (!requestedPath) {
      return NextResponse.json({ error: 'Invalid certificate file.' }, { status: 400 })
    }

    // Backward compatibility for old links that contain a stored path.
    const requestedFilename = certificateFilename(requestedPath)
    const { data: matchingCertificates } = await supabase
      .from('certificates')
      .select('certificate_pdf')
      .eq('active', true)

    const exactMatch = matchingCertificates?.find((row) =>
      normalizeCertificatePath(row.certificate_pdf || '') === requestedPath,
    )

    if (exactMatch?.certificate_pdf) {
      path = normalizeCertificatePath(exactMatch.certificate_pdf)
    } else {
      const filenameMatch = matchingCertificates?.find((row) => {
        const candidate = normalizeCertificatePath(row.certificate_pdf || '')
        return certificateFilename(candidate) === requestedFilename
      })

      if (filenameMatch?.certificate_pdf) {
        path = normalizeCertificatePath(filenameMatch.certificate_pdf)
      }
    }
  }

  if (!path) {
    return NextResponse.json({ error: 'Certificate not found.' }, { status: 404 })
  }

  const { data: publicData } = supabase.storage.from('certificates').getPublicUrl(path)
  if (!publicData?.publicUrl) {
    return NextResponse.json({ error: 'Unable to open certificate.' }, { status: 500 })
  }

  // Proxy the PDF through the portfolio's own origin. This avoids mobile
  // browser redirects, stale Supabase URLs, and iframe/CORS viewer issues.
  const pdfResponse = await fetch(publicData.publicUrl, {
    cache: 'no-store',
    headers: { Accept: 'application/pdf' },
  })

  if (!pdfResponse.ok) {
    return NextResponse.json({ error: 'Certificate PDF is unavailable.' }, { status: 404 })
  }

  const outputFilename = path.split('/').pop()?.replace(/[^a-zA-Z0-9._-]/g, '-') || 'certificate.pdf'
  const download = url.searchParams.get('download') === '1'
  const contentType = pdfResponse.headers.get('content-type') || 'application/pdf'
  const contentLength = pdfResponse.headers.get('content-length')

  return new Response(pdfResponse.body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      ...(contentLength ? { 'Content-Length': contentLength } : {}),
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${outputFilename}"`,
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
