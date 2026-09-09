# Contributing

## Development workflow

1. Create a focused branch for the change.
2. Install dependencies with `npm install`.
3. Run `npm run typecheck` and `npm run lint` before opening a pull request.
4. Run `npm run build` for changes that affect application behavior, routing, metadata, or styling.
5. Keep commits focused and describe the user or developer value of the change.

## Portfolio content

Only add information that can be verified from the owner's source material or the application's existing content. Do not invent achievements, metrics, clients, certifications, employment history, or project results.

## UI changes

Preserve responsive behavior and keyboard accessibility. Prefer existing components and design tokens over introducing one-off patterns. Check reduced-motion behavior when adding animations.

## Security

Never commit secrets or local environment files. See [SECURITY.md](./SECURITY.md) for vulnerability reporting guidance.
