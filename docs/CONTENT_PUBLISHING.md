# Portfolio Content Publishing

The portfolio uses a Next.js application with Supabase-backed content and dedicated admin routes.

## Content surfaces

The repository contains editors for profile sections, education, projects, certificates, and UI-experience settings. Public project pages live under app/projects/[slug].

## Publishing rules

Keep content values separate from presentation code whenever the existing content model already supports the field. Validate edits before publishing and confirm that a public page still renders correctly after a content-model change.

## Media

3D assets and cinematic media are stored under public/ and are independent of the Supabase content records. Large media changes should be reviewed against the repository's performance budget and mobile behavior.
