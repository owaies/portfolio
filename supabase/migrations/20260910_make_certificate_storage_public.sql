-- Certificate PDFs are intentionally public portfolio assets, matching the
-- working resume delivery model. Admin upload/update/delete remains protected
-- by the existing storage policies.
update storage.buckets set public = true where id = 'certificates';
