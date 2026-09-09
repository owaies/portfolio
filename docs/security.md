# Application Security Notes

The application uses Supabase authentication and server-side authorization for CMS mutations.

- Keep service-role credentials out of browser code and source control.
- Treat uploaded files, form fields, and external URLs as untrusted input.
- Keep private storage buckets private and issue short-lived access URLs when needed.
- Preserve response security headers configured in `next.config.ts`.
- Review dependency and GitHub Actions updates before merging.
- Do not weaken authentication checks to make local development easier.
- Report sensitive vulnerabilities privately using `SECURITY.md`.
