# Troubleshooting

## Build fails

Run `npm run typecheck`, then `npm run lint`, then `npm run build` to isolate the failure category.

## Content is missing

Check the relevant Supabase row, its published/active flag, and the browser-facing route. Public pages intentionally use fallback profile content for selected optional values.

## Admin redirects to login

Confirm the Supabase session is valid and the authenticated profile has the required administrator role.

## Resume fails

Verify the active resume record and its storage object path. Private storage must be accessed through controlled server-side logic.
