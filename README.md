# Mohammed Owaies · AI/ML Engineer Portfolio

A cinematic, production-oriented portfolio built with Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Supabase and Vercel.

## Highlights
- Cinematic single-page narrative: Hero → About → Skills → Projects → Experience → Education → Certifications → Languages → Resume → Contact.
- Supabase-backed content for portfolio records, publishing, ordering and CMS administration.
- Supabase Auth + server-enforced `profiles.role = 'admin'` authorization and RLS.
- Supabase Storage support for portfolio media, certificates, resumes and gallery assets.
- Framer Motion reveal/stagger system, lightweight canvas particles, cursor glow, orbital profile treatment and reduced-motion support.
- Responsive mobile navigation, semantic sections, keyboard-friendly controls and strong metadata/structured data.
- Graceful empty states when optional database content is unavailable.

## Stack
Next.js · React · TypeScript · Tailwind CSS · Framer Motion · Lucide React · Supabase PostgreSQL · Supabase Auth · Supabase Storage · Vercel

## Architecture
`GitHub → Vercel → Next.js → Supabase (PostgreSQL/Auth/Storage)`

The public homepage reads published/active records from Supabase. The `/admin` area uses Supabase Auth and existing reusable CRUD/upload components. Service-role credentials are never intended for browser code.

## Local development
1. Create a Supabase project.
2. Run the SQL migrations in `supabase/migrations/` using the Supabase SQL editor or Supabase CLI.
3. Create an admin user in Supabase Auth and give the corresponding `profiles` row the `admin` role.
4. Copy `.env.example` to `.env.local` and fill in the values:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

5. Install and run:

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and `/admin`.

## Supabase
The initial migration creates/uses: `profiles`, `site_content`, `projects`, `skills`, `experience`, `education`, `certificates`, `languages`, `resumes`, `gallery` and `contact_messages`, with indexes, updated timestamps, RLS and admin policies. Storage buckets are configured for portfolio media.

Keep the service-role key server-only. Public reads are limited to published/active content through RLS. Writes require an authenticated admin.

## Admin CMS
`/admin` provides the existing dashboard and CRUD flows for portfolio content, including project editing, skill levels, education, experience, certificates, languages, gallery, resume and site content. Upload validation and destructive-action confirmation should be used for important records.

## Vercel deployment
1. Push the repository to GitHub.
2. Import `owaies/portfolio` into Vercel.
3. Add the same Supabase environment variables in Vercel Project Settings.
4. Deploy with the existing Next.js build command.

Recommended checks before deployment:

```bash
npm run lint
npm run typecheck
npm run build
```

## Security
- `.env`, `.env.local` and secret files must remain ignored.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to client components.
- Authorization is enforced by Supabase RLS rather than an email-only browser check.
- Validate uploads and URLs at the admin boundary.

## Screenshots
Add production screenshots here after the Vercel deployment is verified.

## License
Personal portfolio project by Mohammed Owaies.
