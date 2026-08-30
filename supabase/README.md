# Supabase setup

Project ref: `tpqvmupdvxqloykqkpwj`

Run the migration `supabase/migrations/20260830_portfolio.sql` against the existing project. The application expects these public tables: `profiles`, `projects`, `skills`, `languages`, `experience`, `education`, `certificates`, `resumes`, `gallery`, `site_content`, `contact_messages`.

Create the first admin user in Supabase Auth, then insert/update its `public.profiles` row with `role='admin'`.

The migration creates the five required Storage buckets and the public/private read boundaries described by the portfolio architecture.
