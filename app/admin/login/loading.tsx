export default function LoginLoading() {
  return (
    <main className="grid-bg flex min-h-screen items-center justify-center p-6" aria-label="Loading admin login" aria-busy="true">
      <div className="glass w-full max-w-md rounded-3xl p-8" role="status" aria-live="polite">
        <span className="sr-only">Loading secure admin login</span>
        <div className="h-5 w-28 animate-pulse rounded bg-white/[.06]" aria-hidden="true" />
        <div className="mt-5 h-10 w-3/4 animate-pulse rounded-xl bg-white/[.06]" aria-hidden="true" />
        <div className="mt-3 h-5 w-full animate-pulse rounded bg-white/[.05]" aria-hidden="true" />
        <div className="mt-8 space-y-3" aria-hidden="true">
          <div className="h-12 animate-pulse rounded-xl bg-white/[.05]" />
          <div className="h-12 animate-pulse rounded-xl bg-white/[.05]" />
        </div>
      </div>
    </main>
  )
}
