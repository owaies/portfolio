# Release Checklist

Before shipping a production change:

- Review the diff for unrelated changes.
- Confirm no secrets or local environment files were added.
- Run TypeScript validation and ESLint.
- Run the production build.
- Check the affected public route on mobile and desktop.
- Check keyboard interaction for changed controls.
- Verify links and metadata when routing or SEO changed.
- Wait for the GitHub Actions quality workflow to finish.
- Verify the deployed site after release.
