# Mohammed Owaies Portfolio

Production-ready AI/ML engineer portfolio built with Next.js App Router, TypeScript, Tailwind CSS, Supabase Auth/Postgres/Storage, GitHub, and Vercel.

## Stack
- Next.js App Router + React + TypeScript
- Tailwind CSS + Lucide React
- Supabase SSR/Auth/Postgres/Storage
- Vercel deployment

## Local setup
1. Create or activate a Supabase project.
2. Run `supabase/migrations/20260830_portfolio.sql` in the Supabase SQL Editor.
3. Create an admin Auth user and set that user's `profiles.role` to `admin`.
4. Copy `.env.example` to `.env.local` and add the Supabase URL and publishable key.
5. Install dependencies with `npm install`.
6. Run `npm run dev`.

## Admin
Open `/admin/login`. There is no public registration flow. Access is granted only to a Supabase Auth user whose public profile has `role = admin`.

## Storage
The migration creates: `portfolio-images`, `project-images`, `certificates`, `resumes`, and `gallery`. Public image buckets can be used for portfolio/project/gallery visuals; resume and certificate files are private.

## Vercel
Import `owaies/portfolio` into Vercel and configure the same environment variables for Production/Preview. No paid Vercel service is required by the app.

## Supabase security
The app uses server/client SSR utilities and Row Level Security. The browser never receives a service-role or secret key. Public visitors can read only public/active content and submit contact messages; only admins can read contact messages or manage portfolio content.
