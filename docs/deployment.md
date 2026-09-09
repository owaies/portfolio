# Deployment Runbook

Deploy the repository as a Next.js application on the configured Vercel project.

Before deployment:

- Confirm `npm run typecheck`, `npm run lint`, and `npm run build` pass.
- Configure only the public Supabase URL and publishable key in browser-facing environments.
- Keep private Supabase credentials server-side.
- Verify the production URL after deployment.
- Smoke-test the homepage, project detail route, contact form, resume access, and admin login.

Do not enable paid services or billing changes as part of a routine deployment.
