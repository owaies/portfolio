# Security Policy

## Reporting a vulnerability

Please do not publish security-sensitive details in a public issue. Contact the repository owner privately through the contact details published on the portfolio so the issue can be reviewed before disclosure.

## Security expectations

- Never commit `.env` files, service-role keys, access tokens, or credentials.
- Keep Supabase service credentials server-side only.
- Treat uploaded files and external URLs as untrusted input.
- Review dependency and GitHub Actions updates before merging them.
- Keep the public portfolio and admin surface separated by authentication and authorization checks.

## Scope

This policy covers the Next.js portfolio application and its repository configuration. Third-party infrastructure, accounts, and services remain subject to their own security policies.
