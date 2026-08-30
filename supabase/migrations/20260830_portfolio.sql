create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  role text default 'admin',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(), title text not null, slug text unique not null,
  short_description text default '', detailed_description text default '', technologies text[] default '{}', category text default 'Other',
  thumbnail text, screenshots text[] default '{}', github_url text, live_demo_url text, featured boolean not null default false,
  display_order int not null default 0, published boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(), name text not null, proficiency int not null default 0 check (proficiency between 0 and 100),
  category text not null default 'Other', accent_color text default '#47e9ff', icon text, display_order int not null default 0,
  active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.languages (
  id uuid primary key default gen_random_uuid(), name text not null, proficiency_level text not null, percentage int check (percentage between 0 and 100),
  accent_color text default '#47e9ff', display_order int not null default 0, active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(), company text not null, role text not null, period text, description text, technologies text[] default '{}', location text,
  currently_working boolean not null default false, display_order int not null default 0, active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.education (
  id uuid primary key default gen_random_uuid(), period text not null, degree text not null, institution text not null, details text,
  status text, accent_color text default '#47e9ff', icon text, display_order int not null default 0, active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(), title text not null, issuing_organization text not null, issue_date date, credential_id text, credential_url text,
  thumbnail text, certificate_pdf text, display_order int not null default 0, active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(), label text not null default 'Resume', preview_image text, resume_pdf text, active boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(), image_url text not null, caption text, display_order int not null default 0, featured boolean not null default false,
  published boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.site_content (
  key text primary key, value text not null default '', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null, subject text not null, message text not null,
  read boolean not null default false, created_at timestamptz not null default now()
);

create index if not exists idx_projects_published_order on public.projects(published, display_order);
create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_skills_active_order on public.skills(active, display_order);
create index if not exists idx_education_active_order on public.education(active, display_order);
create index if not exists idx_certificates_active_order on public.certificates(active, display_order);
create index if not exists idx_gallery_published_order on public.gallery(published, display_order);
create index if not exists idx_experience_active_order on public.experience(active, display_order);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.skills enable row level security;
alter table public.languages enable row level security;
alter table public.experience enable row level security;
alter table public.education enable row level security;
alter table public.certificates enable row level security;
alter table public.resumes enable row level security;
alter table public.gallery enable row level security;
alter table public.site_content enable row level security;
alter table public.contact_messages enable row level security;

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

drop policy if exists "public published projects" on public.projects;
create policy "public published projects" on public.projects for select to anon, authenticated using (published = true);
drop policy if exists "admin projects" on public.projects;
create policy "admin projects" on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "public active skills" on public.skills for select to anon, authenticated using (active = true);
create policy "admin skills" on public.skills for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public active languages" on public.languages for select to anon, authenticated using (active = true);
create policy "admin languages" on public.languages for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public active experience" on public.experience for select to anon, authenticated using (active = true);
create policy "admin experience" on public.experience for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public active education" on public.education for select to anon, authenticated using (active = true);
create policy "admin education" on public.education for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public active certificates" on public.certificates for select to anon, authenticated using (active = true);
create policy "admin certificates" on public.certificates for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public active resume" on public.resumes for select to anon, authenticated using (active = true);
create policy "admin resumes" on public.resumes for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public gallery" on public.gallery for select to anon, authenticated using (published = true);
create policy "admin gallery" on public.gallery for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "public content" on public.site_content for select to anon, authenticated using (true);
create policy "admin content" on public.site_content for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin profiles" on public.profiles for all to authenticated using (public.is_admin() or id = auth.uid()) with check (public.is_admin() or id = auth.uid());
create policy "public contact insert" on public.contact_messages for insert to anon, authenticated with check (true);
create policy "admin contact read" on public.contact_messages for select to authenticated using (public.is_admin());
create policy "admin contact update" on public.contact_messages for update to authenticated using (public.is_admin()) with check (public.is_admin());

insert into public.site_content(key,value) values
('hero_subtitle','Aspiring AI/ML Engineer at PESITM, building robust machine learning systems and turning data into intelligent, real-world solutions.'),
('hero_cgpa','7.52'),('hero_projects_count','3+'),('hero_certs_count','5+'),('about_heading','Turning ideas into intelligent systems'),
('about_text_1','I’m Mohammed Owaies, an aspiring AI/ML Engineer focused on building practical software that connects data, algorithms and user needs.'),
('about_text_2','I enjoy machine learning, computer vision, data structures and real-world project work, while continuously sharpening my engineering fundamentals.'),
('about_card_bio','AI/ML • Computer Vision • DSA • Software Development'),
('contact_email','owaies786@gmail.com'),('contact_phone','7619329863'),('contact_location','Tank Mohalla 4th Cross, Shivamogga, Karnataka, India 577201'),
('github_url','https://github.com/owaies'),('linkedin_url','https://www.linkedin.com/in/mohammed-owaies-507b4a398'),('whatsapp_number','917619329863'),
('footer_text','© Mohammed Owaies • AI/ML Engineer')
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.skills(name,proficiency,category,display_order) values
('Python',90,'Languages',1),('C Programming',75,'Languages',2),('Core Java',75,'Languages',3),('PHP',65,'Languages',4),('HTML & CSS',85,'Web Development',5),('MongoDB',72,'Databases & Tools',6),('MySQL',78,'Databases & Tools',7),('Data Structures & Algorithms',82,'Other',8),('Machine Learning',82,'AI / ML',9),('Computer Vision',78,'AI / ML',10)
on conflict do nothing;

insert into public.languages(name,proficiency_level,percentage,display_order) values
('English','Fluent',100,1),('Urdu','Fluent',100,2),('Kannada','Conversational',65,3),('Hindi','Conversational',65,4)
on conflict do nothing;

insert into storage.buckets (id,name,public) values
('portfolio-images','portfolio-images',true),('project-images','project-images',true),('certificates','certificates',false),('resumes','resumes',false),('gallery','gallery',true)
on conflict (id) do nothing;

create policy "public portfolio image read" on storage.objects for select to anon, authenticated using (bucket_id in ('portfolio-images','project-images','gallery'));
create policy "admin storage insert" on storage.objects for insert to authenticated with check (public.is_admin());
create policy "admin storage update" on storage.objects for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admin storage delete" on storage.objects for delete to authenticated using (public.is_admin());
