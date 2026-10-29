import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MAX_PDF_BYTES, readResponseWithLimit } from '@/lib/read-limited-response'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('resumes')
    .select('resume_pdf, active')
    .eq('id', id)
    .eq('active', true)
    .maybeSingle()

  if (error || !data?.resume_pdf) {
    return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
  }

  // The resumes bucket is public so visitors can view the active resume.
  // Keep the database value as the storage object path, and build the public URL here.
  const { data: publicData } = supabase.storage.from('resumes').getPublicUrl(data.resume_pdf)
  if (!publicData?.publicUrl) {
    return NextResponse.json({ error: 'Unable to open resume' }, { status: 500 })
  }

  const url = new URL(request.url)
  if (url.searchParams.get('download') === '1') {
    const response = await fetch(publicData.publicUrl, { cache: 'no-store' })
    if (!response.ok) {
      return NextResponse.json({ error: 'Unable to download resume' }, { status: 502 })
    }
    const body = await readResponseWithLimit(response, MAX_PDF_BYTES)
    if (!body) {
      return NextResponse.json({ error: 'Resume exceeds the 20 MB download limit.' }, { status: 413 })
    }
    return new NextResponse(body, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="Mohammed-Owaies-Resume.pdf"',
        'Cache-Control': 'no-store',
        'Content-Length': String(body.byteLength),
        'X-Content-Type-Options': 'nosniff',
      },
    })
  }

  return NextResponse.redirect(publicData.publicUrl)
}
