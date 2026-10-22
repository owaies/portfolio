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

Email validation rejects whitespace anywhere in the address and requires a non-empty local part, a domain, and a literal dot in the domain. It is a basic form-validation check, not proof that the mailbox exists or can receive mail.

## Responses

- `200 { "ok": true }` when the message is stored.
- `400` with a generic validation or spam error for invalid input.
- `500` with a generic message when storage or request processing fails.

## Regression checklist

Before changing this endpoint, verify these representative inputs:

| Email input | Expected result |
| --- | --- |
| `person@example.com` | Passes the email-shape check |
| ` person@example.com ` | Passes after trimming |
| `person @example.com` | Rejected |
| `person@example .com` | Rejected |
| `person@examplecom` | Rejected |
| `@example.com` | Rejected |

Also verify that a message shorter than 10 characters or longer than 5000 characters is rejected, non-text values are rejected, and a non-empty `website` honeypot value receives a `400` response.

The route inserts accepted messages into the Supabase `contact_messages` table. Keep service-role credentials on the server and do not add them to browser form configuration.
