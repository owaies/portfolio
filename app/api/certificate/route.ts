import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

function normalizeCertificatePath(value: string) {
  const raw = decodeURIComponent(value).trim()
  if (!raw) return ''
  if (raw.startsWith('certificates/') && !raw.includes('..')) return raw

  try {
    const parsed = new URL(raw)
    const marker = '/storage/v1/object/'
    const markerIndex = parsed.pathname.indexOf(marker)
    if (markerIndex !== -1) {
      const remainder = parsed.pathname.slice(markerIndex + marker.length)
      const parts = remainder.split('/').filter(Boolean)
      const bucketIndex = parts.findIndex(part => part === 'certificates')
      if (bucketIndex !== -1) {
        const objectPath = parts.slice(bucketIndex + 1).join('/')
        if (objectPath && !objectPath.includes('..')) return `certificates/${objectPath}`
      }
    }
  } catch {
    // Reject malformed/non-storage values below.
  }
  return ''
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const path = normalizeCertificatePath(url.searchParams.get('path') || '')
  if (!path) return NextResponse.json({ error: 'Invalid certificate file.' }, { status: 400 })

  const supabase = await createClient()
  const { data, error } = await supabase.storage.from('certificates').createSignedUrl(path, 300)
  if (error || !data?.signedUrl) {
    return NextResponse.json({ error: 'Certificate file is unavailable. Please replace the PDF from Admin → Certificates.' }, { status: 404 })
  }

  if (url.searchParams.get('download') === '1') {
    const response = await fetch(data.signedUrl, { cache: 'no-store' })
    if (!response.ok) return NextResponse.json({ error: 'Unable to download certificate.' }, { status: 502 })
    const body = await response.arrayBuffer()
    const filename = path.split('/').pop()?.replace(/[^a-zA-Z0-9._-]/g, '-') || 'certificate.pdf'
    return new NextResponse(body, { headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="${filename}"`, 'Cache-Control': 'private, no-store' } })
  }

  return NextResponse.redirect(data.signedUrl)
}
