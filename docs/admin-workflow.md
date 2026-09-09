# Admin CMS Workflow

The admin surface lives under `/admin` and uses Supabase authentication plus the administrator profile role.

Content sections map to the supported portfolio tables. Server actions validate the selected table and allowed fields before writing data.

For a content change:

1. Sign in through `/admin/login`.
2. Open the relevant CMS section.
3. Validate the content before saving.
4. Confirm the public page after revalidation.
5. Run the project quality checks for code changes.

Do not bypass authorization checks or edit production data directly when the CMS can safely perform the operation.
