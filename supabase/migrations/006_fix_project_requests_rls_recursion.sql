-- Fix: infinite recursion detected in policy for relation "project_requests"
-- Cause: project_requests policies queried request_invitations (and child tables queried
-- project_requests), which re-triggered project_requests RLS in a loop.
-- Run in Supabase SQL Editor after migrations 001–005.

-- ---------------------------------------------------------------------------
-- SECURITY DEFINER helpers (bypass RLS — break cross-table policy cycles)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_project_client(p_request_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.project_requests
    WHERE id = p_request_id AND client_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_invited_to_request(p_request_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.request_invitations ri
    JOIN public.agencies a ON a.id = ri.agency_id
    WHERE ri.request_id = p_request_id
      AND (a.owner_id = auth.uid() OR public.is_agency_member(a.id))
  );
$$;

CREATE OR REPLACE FUNCTION public.my_agency_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.agencies WHERE owner_id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.is_agency_member(target_agency_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.agency_members
    WHERE agency_id = target_agency_id
      AND user_id = auth.uid()
      AND is_active = true
  ) OR EXISTS (
    SELECT 1 FROM public.agencies
    WHERE id = target_agency_id AND owner_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_project_client(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_invited_to_request(UUID) TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.my_agency_id() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.is_agency_member(UUID) TO authenticated, anon;

-- ---------------------------------------------------------------------------
-- project_requests — no cross-table subqueries in policies
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS requests_staff ON public.project_requests;
DROP POLICY IF EXISTS requests_client ON public.project_requests;
DROP POLICY IF EXISTS requests_agency_invited ON public.project_requests;

CREATE POLICY requests_client ON public.project_requests
  FOR ALL
  USING (client_id = auth.uid() OR public.is_admin())
  WITH CHECK (client_id = auth.uid() OR public.is_admin());

CREATE POLICY requests_agency_invited ON public.project_requests
  FOR SELECT
  USING (public.is_invited_to_request(id));

-- ---------------------------------------------------------------------------
-- Child tables — use is_project_client() instead of querying project_requests
-- ---------------------------------------------------------------------------

DROP POLICY IF EXISTS request_services_client ON public.request_services;
CREATE POLICY request_services_client ON public.request_services
  FOR ALL
  USING (public.is_project_client(request_id) OR public.is_admin())
  WITH CHECK (public.is_project_client(request_id) OR public.is_admin());

DROP POLICY IF EXISTS request_documents_client ON public.request_documents;
CREATE POLICY request_documents_client ON public.request_documents
  FOR ALL
  USING (public.is_project_client(request_id) OR public.is_admin())
  WITH CHECK (public.is_project_client(request_id) OR public.is_admin());

DROP POLICY IF EXISTS invitations_client ON public.request_invitations;
CREATE POLICY invitations_client ON public.request_invitations
  FOR ALL
  USING (public.is_project_client(request_id) OR public.is_admin())
  WITH CHECK (public.is_project_client(request_id) OR public.is_admin());

DROP POLICY IF EXISTS quotations_client_read ON public.quotations;
CREATE POLICY quotations_client_read ON public.quotations
  FOR SELECT
  USING (public.is_project_client(request_id) OR public.is_admin());

DROP POLICY IF EXISTS milestones_parties ON public.milestones;
CREATE POLICY milestones_parties ON public.milestones
  FOR ALL
  USING (
    public.is_project_client(request_id)
    OR EXISTS (
      SELECT 1 FROM public.agreements ag
      JOIN public.agencies a ON a.id = ag.agency_id
      WHERE ag.request_id = milestones.request_id
        AND (a.owner_id = auth.uid() OR public.is_agency_member(a.id))
    )
    OR public.is_admin()
  )
  WITH CHECK (
    public.is_project_client(request_id)
    OR EXISTS (
      SELECT 1 FROM public.agreements ag
      JOIN public.agencies a ON a.id = ag.agency_id
      WHERE ag.request_id = milestones.request_id
        AND (a.owner_id = auth.uid() OR public.is_agency_member(a.id))
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS payments_parties ON public.payments;
CREATE POLICY payments_parties ON public.payments
  FOR ALL
  USING (
    public.is_project_client(request_id)
    OR EXISTS (
      SELECT 1 FROM public.agreements ag
      JOIN public.agencies a ON a.id = ag.agency_id
      WHERE ag.request_id = payments.request_id
        AND (a.owner_id = auth.uid() OR public.is_agency_member(a.id))
    )
    OR public.is_admin()
  )
  WITH CHECK (
    public.is_project_client(request_id)
    OR EXISTS (
      SELECT 1 FROM public.agreements ag
      JOIN public.agencies a ON a.id = ag.agency_id
      WHERE ag.request_id = payments.request_id
        AND (a.owner_id = auth.uid() OR public.is_agency_member(a.id))
    )
    OR public.is_admin()
  );

-- ---------------------------------------------------------------------------
-- RPC functions — ensure search_path set (avoid RLS edge cases)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.float_project_request(p_request_id UUID)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite_count INT;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.project_requests
    WHERE id = p_request_id AND client_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  UPDATE public.project_requests
  SET status = 'floating', floated_at = NOW()
  WHERE id = p_request_id;

  INSERT INTO public.request_invitations (request_id, agency_id)
  SELECT p_request_id, id FROM public.agencies WHERE status = 'approved'
  ON CONFLICT (request_id, agency_id) DO NOTHING;

  GET DIAGNOSTICS invite_count = ROW_COUNT;
  RETURN invite_count;
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_quotation(p_quotation_id UUID)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_request_id UUID;
  v_agency_id UUID;
  v_client_id UUID;
  v_agreement_id UUID;
BEGIN
  SELECT q.request_id, q.agency_id, pr.client_id
  INTO v_request_id, v_agency_id, v_client_id
  FROM public.quotations q
  JOIN public.project_requests pr ON pr.id = q.request_id
  WHERE q.id = p_quotation_id AND pr.client_id = auth.uid();

  IF v_request_id IS NULL THEN
    RAISE EXCEPTION 'Quotation not found or not authorized';
  END IF;

  UPDATE public.quotations SET status = 'accepted' WHERE id = p_quotation_id;
  UPDATE public.quotations SET status = 'rejected'
  WHERE request_id = v_request_id AND id != p_quotation_id AND status = 'submitted';
  UPDATE public.project_requests SET status = 'accepted' WHERE id = v_request_id;

  INSERT INTO public.agreements (quotation_id, request_id, agency_id, client_id, signed_at)
  VALUES (p_quotation_id, v_request_id, v_agency_id, v_client_id, NOW())
  RETURNING id INTO v_agreement_id;

  RETURN v_agreement_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.float_project_request(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.accept_quotation(UUID) TO authenticated;
