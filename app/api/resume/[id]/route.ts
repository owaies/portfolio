import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params; const supabase=await createClient(); const {data}=await supabase.from('resumes').select('resume_pdf,active').eq('id',id).eq('active',true).maybeSingle();
 if(!data?.resume_pdf)return NextResponse.json({error:'Resume not found'},{status:404});
 const {data:signed,error}=await supabase.storage.from('resumes').createSignedUrl(data.resume_pdf,300);
 if(error||!signed?.signedUrl)return NextResponse.json({error:'Unable to open resume'},{status:500});
 const url=new URL(request.url); return NextResponse.redirect(signed.signedUrl,{headers:url.searchParams.get('download')==='1'?{'Content-Disposition':'attachment'}:undefined});
}
