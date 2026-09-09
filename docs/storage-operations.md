# Storage Operations

Uploads use unique object paths and sanitized filenames. The admin editor maps fields to their intended Supabase Storage bucket.

Before changing storage behavior, confirm whether the bucket is public or private in the schema and existing application documentation.

For private documents, never expose a permanent public URL. Prefer short-lived signed access URLs or a protected server-side proxy.

Test upload, replacement, missing-object, and access-denied scenarios after storage changes.
