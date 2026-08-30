'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLogin() {
  const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [loading,setLoading]=useState(false)
  async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setError('');const supabase=createClient();const {error}=await supabase.auth.signInWithPassword({email,password});if(error){setError(error.message);setLoading(false);return}window.location.href='/admin'}
  return <main className="grid-bg flex min-h-screen items-center justify-center p-6"><form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-8"><p className="mono text-xs text-cyan-300">ADMIN / AUTH</p><h1 className="mt-3 text-3xl font-bold">Portfolio Control Room</h1><p className="mt-2 text-slate-400">Admin access is restricted to your configured Supabase user.</p><label className="mt-6 block text-sm text-slate-400">Email<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3"/></label><label className="mt-4 block text-sm text-slate-400">Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3"/></label>{error&&<p className="mt-4 rounded-xl border border-red-300/20 bg-red-300/5 p-3 text-sm text-red-300">{error}</p>}<button disabled={loading} className="mt-5 w-full rounded-xl bg-white p-3 font-semibold text-black">{loading?'Signing in…':'Sign in'}</button></form></main>
}
