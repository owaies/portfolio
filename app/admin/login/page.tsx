'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const ADMIN_EMAIL = 'owaies786@gmail.com'

export default function AdminLogin() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetMessage, setResetMessage] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResetMessage('')

    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setError('This admin account is restricted to the configured administrator email.')
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  async function resetPassword() {
    setError('')
    setResetMessage('')
    setResetLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(ADMIN_EMAIL, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setResetMessage(`A password reset email has been sent to ${ADMIN_EMAIL}.`)
    }

    setResetLoading(false)
  }

  return (
    <main className="grid-bg flex min-h-screen items-center justify-center p-6">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-8">
        <p className="mono text-xs text-cyan-300">ADMIN / AUTH</p>
        <h1 className="mt-3 text-3xl font-bold">Portfolio Control Room</h1>
        <p className="mt-2 text-slate-400">Admin access is restricted to your configured Supabase user.</p>

        <label className="mt-6 block text-sm text-slate-400">
          Email
          <input
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3"
          />
        </label>

        <label className="mt-4 block text-sm text-slate-400">
          Password
          <span className="relative mt-2 block">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/30 p-3 pr-12"
              aria-label="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(value => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 transition hover:text-white"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </span>
        </label>

        {error && <p className="mt-4 rounded-xl border border-red-300/20 bg-red-300/5 p-3 text-sm text-red-300">{error}</p>}
        {resetMessage && <p className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/5 p-3 text-sm text-cyan-200">{resetMessage}</p>}
        <button disabled={loading} className="mt-5 w-full rounded-xl bg-white p-3 font-semibold text-black">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <button
          type="button"
          onClick={resetPassword}
          disabled={resetLoading}
          className="mt-3 w-full rounded-xl border border-white/10 p-3 text-slate-300 transition hover:border-cyan-300/40 hover:text-white disabled:opacity-60"
        >
          {resetLoading ? 'Sending reset email…' : 'Forgot password?'}
        </button>
      </form>
    </main>
  )
}
