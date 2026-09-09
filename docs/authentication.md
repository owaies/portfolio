# Authentication Boundaries

The admin login uses Supabase Auth. There is no public registration flow.

Authenticated admin pages verify the current session, while server actions additionally verify the administrator profile role before mutating CMS data.

Password reset links return to the dedicated reset route, where the active Supabase session is checked before allowing a password update.

Keep authentication failures generic where revealing account state would create unnecessary information exposure.
