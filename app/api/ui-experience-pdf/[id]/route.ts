import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { isUIExperienceId } from '@/lib/ui-experiences'
import { MAX_PDF_BYTES, readResponseWithLimit } from '@/lib/read-limited-response'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!isUIExperienceId(id)) return NextResponse.json({ error: 'Invalid UI experience.' }, { status: 400 })

  const supabase = await createClient()
  const { data } = await supabase.from('site_content').select('value').eq('key', `ui_experience_pdf_${id}`).maybeSingle()
  const url = data?.value?.trim()
  if (!url) return NextResponse.json({ error: 'No PDF has been configured for this UI experience.' }, { status: 404 })

  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) return NextResponse.json({ error: 'PDF could not be loaded.' }, { status: 404 })
    const body = await readResponseWithLimit(response, MAX_PDF_BYTES)
    if (!body) {
      return NextResponse.json({ error: 'PDF exceeds the 20 MB download limit.' }, { status: 413 })
    }
    const download = request.nextUrl.searchParams.get('download') === '1'
    const filename = `mohammed-owaies-${id}.pdf`
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `${download ? 'attachment' : 'inline'}; filename="${filename}"`,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        'Content-Length': String(body.byteLength),
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return NextResponse.json({ error: 'PDF could not be loaded.' }, { status: 502 })
  }
}
