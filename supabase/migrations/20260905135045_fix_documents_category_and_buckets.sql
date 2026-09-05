-- Fix documents.category encoding and add Διαγωνισμοί.
-- Create public storage buckets used by the admin dashboard.

ALTER TABLE public.documents DROP CONSTRAINT IF EXISTS documents_category_check;
ALTER TABLE public.documents ADD CONSTRAINT documents_category_check
  CHECK (category = ANY (ARRAY[
    'Ύδρευση'::text,
    'Αποχέτευση'::text,
    'Γενικά'::text,
    'Οικονομικά'::text,
    'Διαγωνισμοί'::text
  ]));

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('documents', 'documents', true, 52428800, ARRAY['application/pdf']),
  ('tenders', 'tenders', true, 52428800, ARRAY['application/pdf', 'application/zip']),
  ('announcements', 'announcements', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;
