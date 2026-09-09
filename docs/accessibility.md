# Accessibility Checklist

Use this checklist when changing public or admin UI.

- Keep one clear page heading and use semantic landmarks.
- Give every form control an accessible name.
- Preserve visible keyboard focus with `:focus-visible` styles.
- Use `aria-live` for asynchronous status and error messages when appropriate.
- Ensure dialogs expose a name and `aria-modal="true"`.
- Keep interactive targets usable on touch devices.
- Respect `prefers-reduced-motion` for non-essential animation.
- Verify contrast for body text, muted text, controls, and focus indicators.
- Test navigation with keyboard-only interaction before merging.
