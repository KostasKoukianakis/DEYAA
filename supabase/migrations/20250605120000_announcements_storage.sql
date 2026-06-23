-- Public bucket for announcement featured images
INSERT INTO storage.buckets (id, name, public)
VALUES ('announcements', 'announcements', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access Announcements" ON storage.objects
FOR SELECT USING (bucket_id = 'announcements');

CREATE POLICY "Authenticated users can upload announcements" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'announcements' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update announcements" ON storage.objects
FOR UPDATE USING (bucket_id = 'announcements' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete announcements" ON storage.objects
FOR DELETE USING (bucket_id = 'announcements' AND auth.role() = 'authenticated');
