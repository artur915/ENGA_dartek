-- Request preferences: urgency, quotation limits, distribution, document categories
-- Safe to re-run (idempotent). Ends with PostgREST schema reload.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'project_requests' AND column_name = 'urgency'
  ) THEN
    ALTER TABLE public.project_requests
      ADD COLUMN urgency TEXT NOT NULL DEFAULT 'normal';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'project_requests' AND column_name = 'required_quotations'
  ) THEN
    ALTER TABLE public.project_requests ADD COLUMN required_quotations INT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'project_requests' AND column_name = 'quotation_deadline'
  ) THEN
    ALTER TABLE public.project_requests ADD COLUMN quotation_deadline DATE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'project_requests' AND column_name = 'distribution_type'
  ) THEN
    ALTER TABLE public.project_requests
      ADD COLUMN distribution_type TEXT NOT NULL DEFAULT 'all';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'project_requests' AND column_name = 'distribution_region'
  ) THEN
    ALTER TABLE public.project_requests ADD COLUMN distribution_region TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'project_requests' AND column_name = 'selected_agency_ids'
  ) THEN
    ALTER TABLE public.project_requests
      ADD COLUMN selected_agency_ids UUID[] NOT NULL DEFAULT '{}';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'request_documents' AND column_name = 'category'
  ) THEN
    ALTER TABLE public.request_documents
      ADD COLUMN category TEXT NOT NULL DEFAULT 'documents';
  END IF;
END $$;

ALTER TABLE public.project_requests DROP CONSTRAINT IF EXISTS project_requests_urgency_check;
ALTER TABLE public.project_requests
  ADD CONSTRAINT project_requests_urgency_check CHECK (urgency IN ('normal', 'urgent'));

ALTER TABLE public.project_requests DROP CONSTRAINT IF EXISTS project_requests_required_quotations_check;
ALTER TABLE public.project_requests
  ADD CONSTRAINT project_requests_required_quotations_check
  CHECK (required_quotations IS NULL OR required_quotations IN (3, 5, 10));

ALTER TABLE public.project_requests DROP CONSTRAINT IF EXISTS project_requests_distribution_type_check;
ALTER TABLE public.project_requests
  ADD CONSTRAINT project_requests_distribution_type_check
  CHECK (distribution_type IN ('all', 'region', 'agencies'));

ALTER TABLE public.request_documents DROP CONSTRAINT IF EXISTS request_documents_category_check;
ALTER TABLE public.request_documents
  ADD CONSTRAINT request_documents_category_check
  CHECK (category IN ('drawings', 'documents', 'photos'));

CREATE OR REPLACE FUNCTION public.agency_matches_region(p_region TEXT, p_areas TEXT[])
RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  area TEXT;
  normalized_region TEXT;
BEGIN
  IF p_region IS NULL OR p_region = '' OR p_areas IS NULL THEN
    RETURN FALSE;
  END IF;

  IF p_region = ANY(p_areas) THEN
    RETURN TRUE;
  END IF;

  normalized_region := replace(p_region, ' Region', '');

  FOREACH area IN ARRAY p_areas LOOP
    IF area = normalized_region
      OR p_region ILIKE '%' || area || '%'
      OR area ILIKE '%' || normalized_region || '%' THEN
      RETURN TRUE;
    END IF;
  END LOOP;

  RETURN FALSE;
END;
$$;

CREATE OR REPLACE FUNCTION public.float_project_request(p_request_id UUID)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite_count INT;
  v_distribution TEXT;
  v_region TEXT;
  v_selected UUID[];
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.project_requests
    WHERE id = p_request_id AND client_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  SELECT distribution_type, distribution_region, selected_agency_ids
  INTO v_distribution, v_region, v_selected
  FROM public.project_requests
  WHERE id = p_request_id;

  v_distribution := COALESCE(v_distribution, 'all');

  UPDATE public.project_requests
  SET status = 'floating', floated_at = NOW()
  WHERE id = p_request_id;

  IF v_distribution = 'agencies' AND COALESCE(array_length(v_selected, 1), 0) > 0 THEN
    INSERT INTO public.request_invitations (request_id, agency_id)
    SELECT p_request_id, a.id
    FROM public.agencies a
    WHERE a.id = ANY(v_selected) AND a.status = 'approved'
    ON CONFLICT (request_id, agency_id) DO NOTHING;
  ELSIF v_distribution = 'region' AND v_region IS NOT NULL AND v_region <> '' THEN
    INSERT INTO public.request_invitations (request_id, agency_id)
    SELECT p_request_id, a.id
    FROM public.agencies a
    WHERE a.status = 'approved'
      AND public.agency_matches_region(v_region, a.service_areas)
    ON CONFLICT (request_id, agency_id) DO NOTHING;
  ELSE
    INSERT INTO public.request_invitations (request_id, agency_id)
    SELECT p_request_id, a.id FROM public.agencies a WHERE a.status = 'approved'
    ON CONFLICT (request_id, agency_id) DO NOTHING;
  END IF;

  GET DIAGNOSTICS invite_count = ROW_COUNT;
  RETURN invite_count;
END;
$$;

GRANT EXECUTE ON FUNCTION public.float_project_request(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.agency_matches_region(TEXT, TEXT[]) TO authenticated;

NOTIFY pgrst, 'reload schema';
