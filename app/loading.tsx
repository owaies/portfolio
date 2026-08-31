export default function Loading() {
  return (
    <main className="grid-bg min-h-screen p-6 sm:p-10" aria-label="Loading portfolio">
      <div className="mx-auto flex min-h-[90vh] w-full max-w-[1180px] flex-col justify-center gap-8">
        <div className="h-5 w-20 animate-pulse rounded bg-white/[.06]" />
        <div className="h-16 w-[min(700px,90%)] animate-pulse rounded-xl bg-white/[.06]" />
        <div className="h-5 w-[min(580px,85%)] animate-pulse rounded bg-white/[.05]" />
        <div className="grid gap-5 md:grid-cols-2">
          {[1,2,3,4].map(item => <div key={item} className="h-52 animate-pulse rounded-3xl border border-white/[.06] bg-white/[.025]" />)}
        </div>
      </div>
    </main>
  )
}
