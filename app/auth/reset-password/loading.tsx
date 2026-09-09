export default function ResetPasswordLoading() {
  return (
    <main className="grid-bg flex min-h-screen items-center justify-center p-6" aria-label="Loading password reset" aria-busy="true">
      <div className="glass w-full max-w-md rounded-3xl p-8" role="status" aria-live="polite">
        <span className="sr-only">Loading password reset</span>
        <div className="h-5 w-32 animate-pulse rounded bg-white/[.06]" aria-hidden="true" />
        <div className="mt-5 h-10 w-4/5 animate-pulse rounded-xl bg-white/[.06]" aria-hidden="true" />
        <div className="mt-3 h-5 w-full animate-pulse rounded bg-white/[.05]" aria-hidden="true" />
        <div className="mt-8 h-12 animate-pulse rounded-xl bg-white/[.05]" aria-hidden="true" />
        <div className="mt-3 h-12 animate-pulse rounded-xl bg-white/[.05]" aria-hidden="true" />
      </div>
    </main>
  )
}
