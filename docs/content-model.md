# Content Model

Portfolio content is organized around dedicated Supabase tables for projects, skills, languages, experience, education, certificates, resumes, gallery items, and site content.

Public queries should filter for the appropriate published or active state. Ordering fields such as `display_order` keep presentation deterministic.

The admin configuration defines the editable fields for each supported table. New fields should be added deliberately to the schema, server validation, admin editor, and public presentation as required.

Avoid storing presentation-only assumptions in user-entered content when a typed field already exists.
