export default function AdminLoading() {
  return (
    <main className="grid-bg min-h-screen p-6 sm:p-8" aria-labelledby="admin-loading-title" aria-busy="true">
      <div className="mx-auto flex min-h-[70vh] w-full max-w-6xl items-center justify-center">
        <section className="glass w-full max-w-lg rounded-3xl p-8 text-center" role="status" aria-live="polite">
          <span className="sr-only">Loading admin dashboard</span>
          <div className="mx-auto h-12 w-12 animate-pulse rounded-2xl bg-white/[.07]" aria-hidden="true" />
          <h1 id="admin-loading-title" className="mt-5 text-xl font-bold">Loading admin dashboard</h1>
          <p className="mt-2 text-sm text-slate-500">Preparing your portfolio content manager.</p>
        </section>
      </div>
    </main>
  )
}
