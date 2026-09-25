# Portfolio CMS safety checks

The portfolio uses Supabase-backed content and an admin area.

## Authorization
Public pages should read only content intended for publication. Administrative writes require authenticated admin authorization.

## Storage
Treat uploaded portfolio media, certificates, resumes, and gallery files as untrusted input. Validate type and size before storage.

## Data changes
Prefer reversible edits and review destructive actions before applying them.

## Release
Verify RLS policies, admin role checks, storage permissions, and public rendering after schema or CMS changes.
