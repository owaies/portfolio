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
  // UUID-prefixed storage path. Resolve an older cached path by its filename.
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

  // Let Supabase deliver the PDF directly. This is the same delivery model as
  // the working resume viewer and avoids server-side PDF fetch failures on mobile.
  const outputFilename = path.split('/').pop()?.replace(/[^a-zA-Z0-9._-]/g, '-') || 'certificate.pdf'
  const download = url.searchParams.get('download') === '1'

  if (!download) {
    return NextResponse.redirect(publicData.publicUrl)
  }

  const downloadUrl = new URL(publicData.publicUrl)
  downloadUrl.searchParams.set('download', outputFilename)
  return NextResponse.redirect(downloadUrl)
}
