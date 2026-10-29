# PDF proxy download limits

The resume and UI-experience PDF routes cap proxied response bodies at 20 MiB. The shared `lib/read-limited-response.ts` helper checks a declared `Content-Length` when present and also counts streamed bytes, so a missing or inaccurate header cannot bypass the limit.

## Manual regression checks

- A small valid PDF remains available through the resume and UI-experience routes.
- A response with a declared size above 20 MiB is rejected with HTTP 413 before buffering.
- A streamed response that exceeds 20 MiB despite a missing or incorrect length header is cancelled and rejected with HTTP 413.
- The response includes an explicit content length and `X-Content-Type-Options: nosniff`.
- Fetch failures continue to return the existing generic error response without leaking upstream details.
