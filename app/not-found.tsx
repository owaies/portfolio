import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="grid-bg flex min-h-screen items-center justify-center p-6">
      <div className="glass w-full max-w-xl rounded-3xl p-10 text-center">
        <p className="mono text-xs text-cyan-300">404 / NOT FOUND</p>
        <h1 className="mt-3 text-4xl font-bold">This page does not exist.</h1>
        <p className="mt-4 text-slate-400">
          The requested portfolio page could not be found. Use the link below to return to the main site.
        </p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-white px-5 py-3 font-semibold text-black">
          Back to Home
        </Link>
      </div>
    </main>
  )
}
