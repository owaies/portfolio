import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="grid-bg flex min-h-screen items-center justify-center p-6" aria-labelledby="not-found-title">
      <div className="glass w-full max-w-xl rounded-3xl p-10 text-center">
        <p className="mono text-xs text-cyan-300" role="status">404 / NOT FOUND</p>
        <h1 id="not-found-title" className="mt-3 text-4xl font-bold">This page does not exist.</h1>
        <p className="mt-4 text-slate-400">
          The requested portfolio page could not be found. Use the link below to return to the main site.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 font-semibold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300">
          Back to Home
        </Link>
      </div>
    </main>
  )
}
