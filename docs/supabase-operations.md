# Supabase Operations

Use the shared Supabase server client for server-side data access and the browser client only where interactive browser authentication or storage operations require it.

Public queries should select only the data needed by the page and respect published/active flags.

Admin writes must pass authentication and administrator-role checks before reaching database mutations.

When changing a table, update the migration, shared types, admin configuration, validation, and public consumers as needed.
