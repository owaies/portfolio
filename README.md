# Mohammed Owaies Portfolio

AI/ML engineer portfolio built with Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth/Postgres/Storage, GitHub, and Vercel.

## Stack
- Next.js App Router + React + TypeScript
- Tailwind CSS + Lucide React
- Supabase SSR/Auth/Postgres/Storage
- Vercel

## Architecture
- `app/` contains routes, pages, API handlers, shared UI, and global styling.
- `app/projects/[slug]` renders individual public project pages.
- `app/admin` contains the authenticated content-management interface.
- `app/api` contains server-side API handlers for contact and resume access.
- `lib/` contains shared infrastructure such as the Supabase server client.
- `types/` contains shared portfolio data types.
- `supabase/` contains database migrations used to reproduce the portfolio schema.

## Local setup
1. Use the existing Supabase project: `tpqvmupdvxqloykqkpwj`.
2. Apply `supabase/migrations/20260830_portfolio.sql` to the database. The live project also has a compatibility migration recorded as `portfolio_schema_20260830_compat`.
3. Ensure the existing Supabase Auth user has a row in `public.profiles` with `role = admin`.
4. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
5. Run `npm install`.
6. Run `npm run typecheck`, `npm run lint`, and `npm run build`.
7. Run `npm run dev`.

## Admin
Open `/admin/login`. There is no public registration flow. An authenticated user must also have `public.profiles.role = 'admin'` for CMS mutations.

## Storage
The existing portfolio schema uses these buckets: `portfolio-images`, `project-images`, `certificates`, `resumes`, and `gallery`. Resume and certificate buckets are private; portfolio/project/gallery image buckets are public.

## Environment variables
Only public Supabase connection values belong in the browser:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

Never commit `.env`, service-role keys, or other secrets.

## Vercel
Deploy the same repository source to Vercel with the Next.js framework. Configure the two public Supabase environment variables for Production and Preview. The app is designed for the free/hobby-compatible architecture and does not require paid services.

## Quality checks

The repository's GitHub Actions quality workflow validates TypeScript, linting, and the production build for pushes and pull requests targeting `main`. Local validation should use the same commands before submitting a change.

## Security

See [SECURITY.md](./SECURITY.md) for vulnerability reporting and security expectations.
