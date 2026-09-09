'use client'

import { useEffect } from 'react'

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="grid-bg flex min-h-screen items-center justify-center p-6" aria-labelledby="error-title">
      <div className="glass w-full max-w-xl rounded-3xl p-10 text-center">
        <p className="mono text-xs text-cyan-300" role="status">500 / RECOVERY</p>
        <h1 id="error-title" className="mt-3 text-4xl font-bold">The portfolio hit a temporary error.</h1>
        <p className="mt-4 text-slate-400">
          The page shell is still available. Retry the request to reconnect to the live portfolio data.
        </p>
        <button type="button" onClick={() => reset()} className="mt-6 rounded-full bg-white px-5 py-3 font-semibold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
          Try Again
        </button>
      </div>
    </main>
  )
}
