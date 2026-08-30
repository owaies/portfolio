import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/
const limits={name:120,subject:180,message:5000}
export async function POST(request:Request){
 try{
  const form=await request.formData(); if(form.get('website'))return NextResponse.json({error:'Spam detected'},{status:400})
  const name=String(form.get('name')??'').trim(),sender=String(form.get('email')??'').trim(),subject=String(form.get('subject')??'').trim(),message=String(form.get('message')??'').trim()
  if(!name||name.length>limits.name||!email.test(sender)||!subject||subject.length>limits.subject||message.length<10||message.length>limits.message)return NextResponse.json({error:'Please provide valid contact details and a message between 10 and 5000 characters.'},{status:400})
  const supabase=await createClient(); const {error}=await supabase.from('contact_messages').insert({name,email:sender,subject,message}); if(error)return NextResponse.json({error:'Unable to send your message right now.'},{status:500})
  return NextResponse.json({ok:true})
 }catch{return NextResponse.json({error:'Unable to process your message.'},{status:500})}
}
