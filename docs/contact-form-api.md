# Contact form API contract

The public contact endpoint is `POST /api/contact` and accepts `multipart/form-data`.

## Fields

| Field | Requirement |
| --- | --- |
| `name` | Text, trimmed, 1–120 characters |
| `email` | Text, trimmed, valid email shape, at most 254 characters |
| `subject` | Text, trimmed, 1–180 characters |
| `message` | Text, trimmed, 10–5000 characters |
| `website` | Optional honeypot; a non-empty value is rejected as spam |

All four visible fields must be text values. Uploading a file in place of a field is rejected.

## Responses

- `200 { "ok": true }` when the message is stored.
- `400` with a generic validation or spam error for invalid input.
- `500` with a generic message when storage or request processing fails.

The route inserts accepted messages into the Supabase `contact_messages` table. Keep service-role credentials on the server and do not add them to browser form configuration.
