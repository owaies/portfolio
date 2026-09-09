export default function Loading() {
  return (
    <main className="grid-bg min-h-screen p-6 sm:p-10" aria-label="Loading portfolio" aria-busy="true">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-[1180px] flex-col justify-center gap-8" role="status" aria-live="polite">
        <span className="sr-only">Loading portfolio content</span>
        <div className="h-5 w-20 animate-pulse rounded bg-white/[.06]" aria-hidden="true" />
        <div className="h-16 w-[min(700px,90%)] animate-pulse rounded-xl bg-white/[.06]" aria-hidden="true" />
        <div className="h-5 w-[min(580px,85%)] animate-pulse rounded bg-white/[.05]" aria-hidden="true" />
        <div className="grid gap-5 md:grid-cols-2" aria-hidden="true">
          {[1,2,3,4].map(item => <div key={item} className="h-52 animate-pulse rounded-3xl border border-white/[.06] bg-white/[.025]" />)}
        </div>
      </div>
    </main>
  )
}
