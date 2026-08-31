ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS tag text NOT NULL DEFAULT 'Project',
  ADD COLUMN IF NOT EXISTS deployment_type text NOT NULL DEFAULT 'local',
  ADD COLUMN IF NOT EXISTS tag_color text,
  ADD COLUMN IF NOT EXISTS icon text,
  ADD COLUMN IF NOT EXISTS accent_color text NOT NULL DEFAULT '#00d4ff';

ALTER TABLE public.projects
  DROP CONSTRAINT IF EXISTS projects_deployment_type_check,
  DROP CONSTRAINT IF EXISTS projects_tag_color_check,
  DROP CONSTRAINT IF EXISTS projects_icon_check,
  DROP CONSTRAINT IF EXISTS projects_accent_color_check;

ALTER TABLE public.projects
  ADD CONSTRAINT projects_deployment_type_check
    CHECK (deployment_type IN ('deployed', 'local')),
  ADD CONSTRAINT projects_tag_color_check
    CHECK (tag_color IS NULL OR tag_color IN ('green', 'blue', 'yellow')),
  ADD CONSTRAINT projects_icon_check
    CHECK (icon IS NULL OR icon IN ('Eye', 'Layers', 'Monitor', 'HelpCircle', 'Scissors', 'Code', 'Cpu', 'Boxes', 'Database')),
  ADD CONSTRAINT projects_accent_color_check
    CHECK (accent_color ~ '^#[0-9A-Fa-f]{6}$');

UPDATE public.projects
SET tag = COALESCE(NULLIF(tag, ''), 'Project'),
    deployment_type = CASE
      WHEN deployment_type IN ('deployed', 'local') THEN deployment_type
      ELSE 'local'
    END,
    accent_color = COALESCE(NULLIF(accent_color, ''), '#00d4ff');
