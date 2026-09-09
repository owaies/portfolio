# Media Storage Guide

The portfolio uses dedicated Supabase Storage buckets for portfolio images, project images, certificates, resumes, and gallery media.

Keep the existing public/private boundary documented in the schema and README. Public image buckets may expose browser-readable URLs; private document buckets require controlled access.

When uploading through the admin interface, sanitize filenames and use unique object paths so separate uploads cannot overwrite each other accidentally.

Test replacement uploads, missing files, and broken URLs as part of media-related QA.
