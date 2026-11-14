# Certificate PDF proxy checks

Run these checks against a deployment with an active test certificate in the Supabase
`certificates` bucket. Use synthetic files and remove them after testing.

- Request an active certificate by ID and confirm a valid PDF is returned with
  `Content-Type: application/pdf`, an accurate `Content-Length`, and
  `X-Content-Type-Options: nosniff`.
- Request the same certificate with `download=1` and confirm the response uses
  attachment disposition; omit the flag and confirm it remains inline.
- Confirm inactive and unknown certificate records are not served.
- Serve a PDF larger than 20 MiB with a declared content length and confirm the
  proxy returns HTTP 413 without buffering the body.
- Serve a chunked PDF that crosses 20 MiB without a content-length header and
  confirm the stream is cancelled and HTTP 413 is returned.
- Return an HTML error page with HTTP 200 from storage and confirm the proxy
  rejects it with a generic HTTP 502 instead of labeling it as a PDF.
- Return an empty body or simulate a storage timeout/network failure and confirm
  the proxy returns a generic error without exposing upstream details.
- Confirm filenames in `Content-Disposition` contain only safe filename
  characters and that storage object paths are not exposed in error responses.

The automated `npm run test:pdf` check covers PDF signature acceptance and
rejection. The deployment checks above exercise the storage and streaming
boundaries that require an HTTP test environment.
