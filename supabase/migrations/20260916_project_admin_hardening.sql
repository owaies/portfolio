/* Keep project creation aligned with the admin server action and storage upload flow. */

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(
    select 1
    from public.profiles p
    where p.id = auth.uid()
      and p.role = 'admin'
  );
$$;

drop policy if exists "admin projects" on public.projects;
create policy "admin projects" on public.projects
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "admin storage insert" on storage.objects;
create policy "admin storage insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'project-images'
    and public.is_admin()
  );

drop policy if exists "admin storage update" on storage.objects;
create policy "admin storage update" on storage.objects
  for update to authenticated
  using (bucket_id = 'project-images' and public.is_admin())
  with check (bucket_id = 'project-images' and public.is_admin());

drop policy if exists "admin storage delete" on storage.objects;
create policy "admin storage delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'project-images' and public.is_admin());
