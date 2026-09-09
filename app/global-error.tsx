'use client'

import { useEffect } from 'react'
import './globals.css'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="bg-[#0a0807] text-white">
        <main className="flex min-h-screen items-center justify-center p-6" aria-labelledby="global-error-title">
          <section className="w-full max-w-xl rounded-3xl border border-white/10 bg-white/[.03] p-8 text-center shadow-2xl">
            <p className="font-mono text-xs text-cyan-300" role="status">500 / SYSTEM RECOVERY</p>
            <h1 id="global-error-title" className="mt-3 text-3xl font-bold">Something went wrong.</h1>
            <p className="mt-4 text-slate-400">The application could not load this page. Try again or return to the portfolio home page.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={() => reset()} className="rounded-full bg-white px-5 py-3 font-semibold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
                Try Again
              </button>
              <a href="/" className="rounded-full border border-white/10 px-5 py-3 font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
                Back to Home
              </a>
            </div>
          </section>
        </main>
      </body>
    </html>
  )
}
