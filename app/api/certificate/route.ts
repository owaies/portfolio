import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MAX_PDF_BYTES, readResponseWithLimit } from '@/lib/read-limited-response'
import pdfSignature from '@/lib/pdf-signature.cjs'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'

function normalizeCertificatePath(value: string) {
  try {
    const raw = decodeURIComponent(value).trim()
    if (!raw) return ''

    if (!raw.includes('://')) {
      const normalized = raw.replace(/^\/+/, '')
      return normalized && !normalized.includes('..') ? normalized : ''
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

function candidatePaths(path: string) {
  const candidates = [path]
  if (path.startsWith('certificates/')) {
    candidates.push(path.slice('certificates/'.length))
  }
  return [...new Set(candidates.filter(Boolean))]
}

async function fetchCertificatePdf(
  supabase: Awaited<ReturnType<typeof createClient>>,
  paths: string[],
) {
  for (const path of paths) {
    const { data: publicData } = supabase.storage.from('certificates').getPublicUrl(path)
    if (!publicData?.publicUrl) continue

    const response = await fetch(publicData.publicUrl, {
      cache: 'no-store',
      headers: { Accept: 'application/pdf' },
      signal: AbortSignal.timeout(15_000),
    })

    if (response.ok) {
      return { path, response }
    }
  }

  return null
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')?.trim() || ''
  const requestedPath = normalizeCertificatePath(url.searchParams.get('path') || '')
  const supabase = await createClient()

  let path = requestedPath

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

    const requestedFilename = certificateFilename(requestedPath)
    const { data: matchingCertificates } = await supabase
      .from('certificates')
      .select('certificate_pdf')
      .eq('active', true)

    const exactMatch = matchingCertificates?.find((row) =>
      candidatePaths(normalizeCertificatePath(row.certificate_pdf || '')).includes(requestedPath),
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

  let result: Awaited<ReturnType<typeof fetchCertificatePdf>>
  try {
    result = await fetchCertificatePdf(supabase, candidatePaths(path))
  } catch {
    return NextResponse.json(
      { error: 'Certificate PDF is temporarily unavailable.' },
      { status: 502 },
    )
  }

  if (!result) {
    return NextResponse.json(
      { error: 'Certificate PDF is unavailable.' },
      { status: 404 },
    )
  }

  if (!result.response.body) {
    return NextResponse.json(
      { error: 'Certificate PDF response was empty.' },
      { status: 502 },
    )
  }

  let body: ArrayBuffer | null
  try {
    body = await readResponseWithLimit(result.response, MAX_PDF_BYTES)
  } catch {
    return NextResponse.json(
      { error: 'Certificate PDF could not be read.' },
      { status: 502 },
    )
  }

  if (!body) {
    return NextResponse.json(
      { error: 'Certificate PDF exceeds the 20 MB response limit.' },
      { status: 413 },
    )
  }

  if (!pdfSignature.hasPdfSignature(body)) {
    return NextResponse.json(
      { error: 'The stored certificate is not a valid PDF response.' },
      { status: 502 },
    )
  }

  const outputFilename = result.path.split('/').pop()?.replace(/[^a-zA-Z0-9._-]/g, '-') || 'certificate.pdf'
  const download = url.searchParams.get('download') === '1'

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${outputFilename}"`,
      'Cache-Control': 'no-store, max-age=0',
      'Content-Length': String(body.byteLength),
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
