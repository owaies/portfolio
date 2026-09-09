# Performance Notes

Keep the public portfolio lightweight and content-first.

- Prefer server components for data that does not require browser state.
- Avoid adding dependencies for small UI behavior.
- Keep hero content available without client-side hydration requirements.
- Use appropriately sized images and meaningful dimensions to reduce layout shift.
- Avoid unnecessary animations on low-power devices and honor reduced-motion preferences.
- Re-check the production build after routing, metadata, or styling changes.
- Review large client components before introducing additional browser-only work.
