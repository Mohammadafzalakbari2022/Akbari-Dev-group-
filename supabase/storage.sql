-- Akbari Dev Hub — Supabase Storage setup
-- Run in Supabase SQL Editor after creating project

-- Create public media bucket (skip if already created via Dashboard)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'media',
  'media',
  true,
  52428800, -- 50 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf', 'video/mp4']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read for all objects in media bucket
CREATE POLICY "Public read media"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

-- Authenticated users can upload (admin via service role bypasses RLS)
CREATE POLICY "Authenticated upload media"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

-- Authenticated users can update their uploads
CREATE POLICY "Authenticated update media"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'media');

-- Authenticated users can delete
CREATE POLICY "Authenticated delete media"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media');
