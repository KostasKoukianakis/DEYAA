-- Storage Policies for tenders and documents buckets
-- This migration handles existing policies gracefully

-- Drop existing policies if they exist (with different names to avoid conflicts)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Tenders" ON storage.objects;
DROP POLICY IF EXISTS "Public Access Documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tenders" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tenders" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete tenders" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON storage.objects;

-- Policies for tenders bucket
CREATE POLICY "Public Access Tenders" ON storage.objects
FOR SELECT USING (bucket_id = 'tenders');

CREATE POLICY "Authenticated users can upload tenders" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'tenders' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update tenders" ON storage.objects
FOR UPDATE USING (bucket_id = 'tenders' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete tenders" ON storage.objects
FOR DELETE USING (bucket_id = 'tenders' AND auth.role() = 'authenticated');

-- Policies for documents bucket
CREATE POLICY "Public Access Documents" ON storage.objects
FOR SELECT USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can upload documents" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update documents" ON storage.objects
FOR UPDATE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete documents" ON storage.objects
FOR DELETE USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
