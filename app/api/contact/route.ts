import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const email=/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
const limits={name:120,subject:180,message:5000}
export async function POST(request:Request){
 try{
  let form: FormData
  try {
   form = await request.formData()
  } catch {
   return NextResponse.json({error:'Invalid contact form submission.'},{status:400})
  }
  if(form.get('website'))return NextResponse.json({error:'Spam detected'},{status:400})
  const rawName = form.get('name')
  const rawEmail = form.get('email')
  const rawSubject = form.get('subject')
  const rawMessage = form.get('message')
  const isText = (value: FormDataEntryValue | null): value is string => typeof value === 'string'
  if (!isText(rawName) || !isText(rawEmail) || !isText(rawSubject) || !isText(rawMessage)) {
   return NextResponse.json({error:'All contact fields must be text values.'},{status:400})
  }
  const name=rawName.trim(),sender=rawEmail.trim(),subject=rawSubject.trim(),message=rawMessage.trim()
  if(!name||name.length>limits.name||sender.length>254||!email.test(sender)||!subject||subject.length>limits.subject||message.length<10||message.length>limits.message)return NextResponse.json({error:'Please provide valid contact details and a message between 10 and 5000 characters.'},{status:400})
  const supabase=await createClient(); const {error}=await supabase.from('contact_messages').insert({name,email:sender,subject,message}); if(error)return NextResponse.json({error:'Unable to send your message right now.'},{status:500})
  return NextResponse.json({ok:true})
 }catch{return NextResponse.json({error:'Unable to process your message.'},{status:500})}
}
