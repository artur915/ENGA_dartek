-- Auto-active registration: store uploaded Engineering Council certificates.
-- MVP: no government API verification; accounts activate on form + certificate submit.

ALTER TABLE public.agencies
  ADD COLUMN IF NOT EXISTS certificate_path TEXT,
  ADD COLUMN IF NOT EXISTS certificate_file_name TEXT;

ALTER TABLE public.engineer_profiles
  ADD COLUMN IF NOT EXISTS certificate_path TEXT,
  ADD COLUMN IF NOT EXISTS certificate_file_name TEXT,
  ADD COLUMN IF NOT EXISTS registered_at TIMESTAMPTZ;

-- Allow admins to suspend/reject agencies post-registration (moderation).
DROP POLICY IF EXISTS agencies_admin_update ON public.agencies;
CREATE POLICY agencies_admin_update ON public.agencies
  FOR UPDATE
  USING (public.is_admin());

-- Engineer credential documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'engineer-documents',
    'engineer-documents',
    false,
    52428800,
    ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp']
  )
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS storage_engineer_docs_upload ON storage.objects;
CREATE POLICY storage_engineer_docs_upload ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'engineer-documents'
    AND auth.uid() IS NOT NULL
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS storage_engineer_docs_read ON storage.objects;
CREATE POLICY storage_engineer_docs_read ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'engineer-documents'
    AND auth.uid() IS NOT NULL
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

DROP POLICY IF EXISTS storage_engineer_docs_admin_read ON storage.objects;
CREATE POLICY storage_engineer_docs_admin_read ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'engineer-documents'
    AND public.is_admin()
  );
