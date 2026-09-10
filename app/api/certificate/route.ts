import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const path = url.searchParams.get('path')?.trim() || ''
  if (!path || !path.startsWith('certificates/') || path.includes('..')) {
    return NextResponse.json({ error: 'Invalid certificate file.' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data: publicData } = supabase.storage.from('certificates').getPublicUrl(path)
  if (!publicData?.publicUrl) {
    return NextResponse.json({ error: 'Certificate not found.' }, { status: 404 })
  }

  if (url.searchParams.get('download') === '1') {
    const response = await fetch(publicData.publicUrl, { cache: 'no-store' })
    if (!response.ok) {
      return NextResponse.json({ error: 'Unable to download certificate.' }, { status: 502 })
    }
    const body = await response.arrayBuffer()
    const filename = path.split('/').pop()?.replace(/[^a-zA-Z0-9._-]/g, '-') || 'certificate.pdf'
    return new NextResponse(body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  }

  return NextResponse.redirect(publicData.publicUrl)
}
