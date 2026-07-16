-- Complete RLS policies, storage buckets, and helper functions

-- Enable RLS on remaining tables
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE engineering_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_package_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE engineer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE finance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Public read for catalog
CREATE POLICY catalog_categories_read ON service_categories FOR SELECT USING (true);
CREATE POLICY catalog_packages_read ON service_packages FOR SELECT USING (true);
CREATE POLICY catalog_services_read ON engineering_services FOR SELECT USING (true);
CREATE POLICY catalog_package_items_read ON service_package_items FOR SELECT USING (true);

-- Helper: check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: get agency id for current user
CREATE OR REPLACE FUNCTION my_agency_id()
RETURNS UUID AS $$
  SELECT id FROM agencies WHERE owner_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper: check agency membership
CREATE OR REPLACE FUNCTION is_agency_member(target_agency_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM agency_members
    WHERE agency_id = target_agency_id AND user_id = auth.uid() AND is_active = true
  ) OR EXISTS (
    SELECT 1 FROM agencies WHERE id = target_agency_id AND owner_id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Profiles insert (signup trigger + own insert)
DROP POLICY IF EXISTS profiles_insert_signup ON profiles;
CREATE POLICY profiles_insert_signup ON profiles FOR INSERT TO supabase_auth_admin WITH CHECK (true);
CREATE POLICY profiles_insert_own ON profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- Agency members
CREATE POLICY agency_members_select ON agency_members FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM agencies a WHERE a.id = agency_id AND a.owner_id = auth.uid())
  OR is_admin()
);
CREATE POLICY agency_members_insert ON agency_members FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM agencies a WHERE a.id = agency_id AND a.owner_id = auth.uid())
);

-- Request services
CREATE POLICY request_services_client ON request_services FOR ALL USING (
  EXISTS (SELECT 1 FROM project_requests pr WHERE pr.id = request_id AND pr.client_id = auth.uid())
  OR is_admin()
);
CREATE POLICY request_services_agency_read ON request_services FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM request_invitations ri
    JOIN agencies a ON a.id = ri.agency_id
    WHERE ri.request_id = request_services.request_id
    AND (a.owner_id = auth.uid() OR is_agency_member(a.id))
  )
);

-- Request documents
CREATE POLICY request_documents_client ON request_documents FOR ALL USING (
  EXISTS (SELECT 1 FROM project_requests pr WHERE pr.id = request_id AND pr.client_id = auth.uid())
  OR is_admin()
);
CREATE POLICY request_documents_agency_read ON request_documents FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM request_invitations ri
    JOIN agencies a ON a.id = ri.agency_id
    WHERE ri.request_id = request_documents.request_id
    AND (a.owner_id = auth.uid() OR is_agency_member(a.id))
  )
);

-- Request invitations
CREATE POLICY invitations_client ON request_invitations FOR ALL USING (
  EXISTS (SELECT 1 FROM project_requests pr WHERE pr.id = request_id AND pr.client_id = auth.uid())
  OR is_admin()
);
CREATE POLICY invitations_agency_read ON request_invitations FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM agencies a
    WHERE a.id = agency_id AND (a.owner_id = auth.uid() OR is_agency_member(a.id))
  )
);
CREATE POLICY invitations_agency_update ON request_invitations FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM agencies a
    WHERE a.id = agency_id AND (a.owner_id = auth.uid() OR is_agency_member(a.id))
  )
);

-- Agency read for invited requests (extend project_requests)
CREATE POLICY requests_agency_invited ON project_requests FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM request_invitations ri
    JOIN agencies a ON a.id = ri.agency_id
    WHERE ri.request_id = project_requests.id
    AND (a.owner_id = auth.uid() OR is_agency_member(a.id))
  )
);

-- Quotations
CREATE POLICY quotations_client_read ON quotations FOR SELECT USING (
  EXISTS (SELECT 1 FROM project_requests pr WHERE pr.id = request_id AND pr.client_id = auth.uid())
  OR is_admin()
);
CREATE POLICY quotations_agency_manage ON quotations FOR ALL USING (
  EXISTS (
    SELECT 1 FROM agencies a
    WHERE a.id = agency_id AND (a.owner_id = auth.uid() OR is_agency_member(a.id))
  )
);

-- Agreements
CREATE POLICY agreements_parties ON agreements FOR SELECT USING (
  client_id = auth.uid()
  OR EXISTS (SELECT 1 FROM agencies a WHERE a.id = agency_id AND (a.owner_id = auth.uid() OR is_agency_member(a.id)))
  OR is_admin()
);
CREATE POLICY agreements_insert ON agreements FOR INSERT WITH CHECK (
  client_id = auth.uid() OR is_admin()
);

-- Milestones
CREATE POLICY milestones_parties ON milestones FOR ALL USING (
  EXISTS (SELECT 1 FROM project_requests pr WHERE pr.id = request_id AND pr.client_id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM agreements ag
    JOIN agencies a ON a.id = ag.agency_id
    WHERE ag.request_id = milestones.request_id
    AND (a.owner_id = auth.uid() OR is_agency_member(a.id))
  )
  OR is_admin()
);

-- Payments
CREATE POLICY payments_parties ON payments FOR ALL USING (
  EXISTS (SELECT 1 FROM project_requests pr WHERE pr.id = request_id AND pr.client_id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM agreements ag
    JOIN agencies a ON a.id = ag.agency_id
    WHERE ag.request_id = payments.request_id
    AND (a.owner_id = auth.uid() OR is_agency_member(a.id))
  )
  OR is_admin()
);

-- Engineer profiles
CREATE POLICY engineer_profiles_own ON engineer_profiles FOR ALL USING (user_id = auth.uid() OR is_admin());
CREATE POLICY engineer_profiles_public_read ON engineer_profiles FOR SELECT USING (true);

-- Finance records
CREATE POLICY finance_agency ON finance_records FOR ALL USING (
  EXISTS (SELECT 1 FROM agencies a WHERE a.id = agency_id AND (a.owner_id = auth.uid() OR is_agency_member(a.id)))
  OR is_admin()
);

-- Audit logs (admin only write, parties read own)
CREATE POLICY audit_admin ON audit_logs FOR ALL USING (is_admin());
CREATE POLICY audit_own_read ON audit_logs FOR SELECT USING (user_id = auth.uid());

-- Float request function (invites all approved agencies)
CREATE OR REPLACE FUNCTION float_project_request(p_request_id UUID)
RETURNS INT AS $$
DECLARE
  invite_count INT;
BEGIN
  -- Verify ownership
  IF NOT EXISTS (
    SELECT 1 FROM project_requests
    WHERE id = p_request_id AND client_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  -- Update status
  UPDATE project_requests
  SET status = 'floating', floated_at = NOW()
  WHERE id = p_request_id;

  -- Invite all approved agencies
  INSERT INTO request_invitations (request_id, agency_id)
  SELECT p_request_id, id FROM agencies WHERE status = 'approved'
  ON CONFLICT (request_id, agency_id) DO NOTHING;

  GET DIAGNOSTICS invite_count = ROW_COUNT;
  RETURN invite_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Accept quotation function
CREATE OR REPLACE FUNCTION accept_quotation(p_quotation_id UUID)
RETURNS UUID AS $$
DECLARE
  v_request_id UUID;
  v_agency_id UUID;
  v_client_id UUID;
  v_agreement_id UUID;
BEGIN
  SELECT q.request_id, q.agency_id, pr.client_id
  INTO v_request_id, v_agency_id, v_client_id
  FROM quotations q
  JOIN project_requests pr ON pr.id = q.request_id
  WHERE q.id = p_quotation_id AND pr.client_id = auth.uid();

  IF v_request_id IS NULL THEN
    RAISE EXCEPTION 'Quotation not found or not authorized';
  END IF;

  UPDATE quotations SET status = 'accepted' WHERE id = p_quotation_id;
  UPDATE quotations SET status = 'rejected'
  WHERE request_id = v_request_id AND id != p_quotation_id AND status = 'submitted';
  UPDATE project_requests SET status = 'accepted' WHERE id = v_request_id;

  INSERT INTO agreements (quotation_id, request_id, agency_id, client_id, signed_at)
  VALUES (p_quotation_id, v_request_id, v_agency_id, v_client_id, NOW())
  RETURNING id INTO v_agreement_id;

  RETURN v_agreement_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('request-documents', 'request-documents', false, 52428800, ARRAY['application/pdf','image/jpeg','image/png','image/webp','application/dwg']),
  ('agency-documents', 'agency-documents', false, 52428800, ARRAY['application/pdf','image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies: request documents
CREATE POLICY storage_request_docs_upload ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'request-documents' AND auth.uid() IS NOT NULL
);
CREATE POLICY storage_request_docs_read ON storage.objects FOR SELECT USING (
  bucket_id = 'request-documents' AND auth.uid() IS NOT NULL
);
CREATE POLICY storage_request_docs_delete ON storage.objects FOR DELETE USING (
  bucket_id = 'request-documents' AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Storage policies: agency documents
CREATE POLICY storage_agency_docs_upload ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'agency-documents' AND auth.uid() IS NOT NULL
);
CREATE POLICY storage_agency_docs_read ON storage.objects FOR SELECT USING (
  bucket_id = 'agency-documents' AND auth.uid() IS NOT NULL
);
