'use client'

import { useState } from 'react'

export default function ContactForm(){
 const [loading,setLoading]=useState(false),[status,setStatus]=useState('')
 async function submit(e:React.FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setStatus('');const form=new FormData(e.currentTarget);try{const r=await fetch('/api/contact',{method:'POST',body:form});const data=await r.json().catch(()=>({}));if(!r.ok)throw new Error(data.error||'Unable to send your message.');setStatus('Message sent successfully. I’ll get back to you soon.');e.currentTarget.reset()}catch(err){setStatus(err instanceof Error?err.message:'Unable to send your message.')}finally{setLoading(false)}}
 return <form onSubmit={submit} className="glass rounded-3xl p-7"><div className="grid gap-4 sm:grid-cols-2"><Field name="name" label="Name"/><Field name="email" label="Email" type="email"/></div><Field name="subject" label="Subject"/><label className="mt-4 block text-sm text-slate-400">Message<textarea name="message" required minLength={10} rows={6} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none focus:border-cyan-300/50"/></label><input name="website" tabIndex={-1} autoComplete="off" className="hidden"/><button disabled={loading} className="mt-5 rounded-full bg-white px-6 py-3 font-semibold text-black disabled:opacity-50">{loading?'Sending…':'Send Message'}</button>{status&&<p className="mt-4 rounded-xl border border-white/10 p-3 text-sm text-slate-300" role="status">{status}</p>}</form>
}
function Field({name,label,type='text'}:{name:string,label:string,type?:string}){return <label className="mt-4 block text-sm text-slate-400">{label}<input name={name} type={type} required className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-4 outline-none focus:border-cyan-300/50"/></label>}
