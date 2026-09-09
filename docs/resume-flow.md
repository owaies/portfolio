# Resume Access Flow

Resume records are stored in Supabase and exposed through `app/api/resume/[id]/route.ts` only when the record is active.

The database value represents the storage object path. The route is responsible for resolving that path and handling browser viewing versus download requests.

The resume bucket is private according to the portfolio schema, so access logic must not assume a public storage URL.

When changing resume storage, update both the admin upload flow and the public route together and verify view and download behavior separately.
