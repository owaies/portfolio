# Contact Flow

The public contact form posts multipart form data to `app/api/contact/route.ts`.

The server validates the honeypot field, required values, email shape, and configured length limits before inserting a message into `contact_messages` through the server-side Supabase client.

The UI reports success and failure through a status region and resets the form only after a successful response.

When changing this flow, preserve server-side validation even if equivalent browser validation exists. Browser checks improve UX; they are not a security boundary.
