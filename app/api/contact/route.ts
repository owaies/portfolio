import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    if (form.get('website')) return NextResponse.json({ error: 'Spam detected' }, { status: 400 })
    const name = String(form.get('name') ?? '').trim()
    const sender = String(form.get('email') ?? '').trim()
    const subject = String(form.get('subject') ?? '').trim()
    const message = String(form.get('message') ?? '').trim()
    if (!name || !email.test(sender) || !subject || message.length < 10) return NextResponse.json({ error: 'Please provide valid contact details and a longer message.' }, { status: 400 })
    const supabase = await createClient()
    const { error } = await supabase.from('contact_messages').insert({ name, email: sender, subject, message })
    if (error) return NextResponse.json({ error: 'Unable to send your message right now.' }, { status: 500 })
    return NextResponse.redirect(new URL('/?sent=1#contact', request.url), 303)
  } catch { return NextResponse.json({ error: 'Unable to process your message.' }, { status: 500 }) }
}
