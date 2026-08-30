'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setError('This password reset link is invalid or has expired. Please request a new reset email.')
      }
      setLoading(false)
    })
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setSaving(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    router.push('/admin/login')
  }

  return (
    <main className="grid-bg flex min-h-screen items-center justify-center p-6">
      <form onSubmit={submit} className="glass w-full max-w-md rounded-3xl p-8">
        <p className="mono text-xs text-cyan-300">ADMIN / PASSWORD RESET</p>
        <h1 className="mt-3 text-3xl font-bold">Set a New Password</h1>
        <p className="mt-2 text-slate-400">Choose a new password for your portfolio admin account.</p>

        {loading ? (
          <p className="mt-6 text-sm text-slate-400">Checking your reset link…</p>
        ) : (
          <>
            <label className="mt-6 block text-sm text-slate-400">
              New Password
              <span className="relative mt-2 block">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-3 pr-12"
                  aria-label="New password"
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

            <label className="mt-4 block text-sm text-slate-400">
              Confirm Password
              <span className="relative mt-2 block">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/30 p-3 pr-12"
                  aria-label="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(value => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-2 text-slate-400 transition hover:text-white"
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  title={showConfirmPassword ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </span>
            </label>

            {error && (
              <p className="mt-4 rounded-xl border border-red-300/20 bg-red-300/5 p-3 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving || Boolean(error && !newPassword && !confirmPassword)}
              className="mt-5 w-full rounded-xl bg-white p-3 font-semibold text-black disabled:opacity-60"
            >
              {saving ? 'Updating password…' : 'Update Password'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/admin/login')}
              className="mt-3 w-full rounded-xl border border-white/10 p-3 text-slate-300 transition hover:border-cyan-300/40 hover:text-white"
            >
              Back to Sign In
            </button>
          </>
        )}
      </form>
    </main>
  )
}
