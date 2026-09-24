# Deployment verification checklist

Use this checklist before promoting a portfolio change to production.

## Application
- Confirm the production build completes successfully.
- Verify the public homepage loads without console errors.
- Check navigation links and project detail routes.
- Verify responsive layouts at desktop and mobile widths.

## Supabase
- Confirm public reads still work for published content.
- Verify admin-only writes remain protected by authentication and RLS.
- Confirm storage-backed media loads correctly.
- Never expose service-role credentials to browser code.

## Release
- Review the changed files before merging.
- Confirm environment variables are present in the deployment environment.
- Check the final production deployment after the build completes.
