export default function Loading() {
  // The root layout already owns the experience-aware loading screen. Keeping
  // this route fallback empty prevents a second generic skeleton from flashing
  // immediately after the cinematic loader on public experience switches.
  return <div aria-hidden="true" />
}
