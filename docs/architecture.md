# Portfolio Architecture

## Request flow

The public site is rendered through the Next.js App Router. The home page reads published portfolio content from Supabase and falls back to built-in profile copy when optional content is unavailable.

Project detail pages are routed by slug under `app/projects/[slug]`. The admin area is isolated under `app/admin` and uses the authenticated Supabase session plus the profile role for CMS authorization.

## Data boundaries

- Public portfolio content is read through server-side Supabase access.
- Resume and certificate storage remain private according to the portfolio schema.
- Browser configuration contains only public Supabase connection values.
- Server-side API handlers own operations that should not expose privileged credentials.

## Validation path

GitHub Actions runs TypeScript validation, ESLint, and the production build for changes targeting `main`. Local development should run the same checks before review.

## Design principles

Keep public pages fast and content-focused, preserve the existing visual system, prefer semantic HTML and keyboard-accessible controls, and make responsive behavior a first-class concern. Portfolio claims should always come from verified source material or existing application data.
