-- ENGA Engineering Services Marketplace - Initial Schema
-- Sprint 1: Auth, roles, service catalog, agency profiles

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM (
  'client',
  'agency_owner',
  'agency_employee',
  'individual_engineer',
  'finance_user',
  'admin'
);

CREATE TYPE provider_type AS ENUM (
  'engineering_office',
  'specialized_office',
  'office_or_individual',
  'office_or_insurer'
);

CREATE TYPE agency_status AS ENUM (
  'pending',
  'approved',
  'suspended',
  'rejected'
);

CREATE TYPE request_status AS ENUM (
  'draft',
  'submitted',
  'floating',
  'quoted',
  'accepted',
  'in_progress',
  'completed',
  'archived',
  'cancelled'
);

CREATE TYPE quotation_status AS ENUM (
  'draft',
  'submitted',
  'revised',
  'accepted',
  'rejected',
  'expired'
);

CREATE TYPE milestone_status AS ENUM (
  'green',
  'amber',
  'red'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'confirmed',
  'failed'
);

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role NOT NULL DEFAULT 'client',
  locale TEXT NOT NULL DEFAULT 'en' CHECK (locale IN ('en', 'ar')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Service categories
CREATE TABLE service_categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  name_ar TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- Service packages (homeowner journeys)
CREATE TABLE service_packages (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  name_ar TEXT,
  description TEXT,
  description_ar TEXT,
  categories_included TEXT,
  sort_order INT NOT NULL DEFAULT 0
);

-- Engineering services catalog (147 services)
CREATE TABLE engineering_services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  name_ar TEXT,
  category_id INT NOT NULL REFERENCES service_categories(id),
  provider TEXT NOT NULL,
  provider_type provider_type NOT NULL,
  sort_order INT NOT NULL DEFAULT 0
);

-- Many-to-many: services <-> packages
CREATE TABLE service_package_items (
  service_id INT NOT NULL REFERENCES engineering_services(id) ON DELETE CASCADE,
  package_id INT NOT NULL REFERENCES service_packages(id) ON DELETE CASCADE,
  PRIMARY KEY (service_id, package_id)
);

-- Engineering agencies / offices
CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id),
  name TEXT NOT NULL,
  name_ar TEXT,
  commercial_registration TEXT,
  engineering_license TEXT,
  description TEXT,
  description_ar TEXT,
  disciplines TEXT[] DEFAULT '{}',
  service_areas TEXT[] DEFAULT '{}',
  indicative_price_from DECIMAL(12,2),
  status agency_status NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agency team members
CREATE TABLE agency_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (agency_id, user_id)
);

-- Individual engineer profiles
CREATE TABLE engineer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  specialization TEXT,
  experience_years INT,
  council_membership TEXT,
  professional_license TEXT,
  linked_agency_id UUID REFERENCES agencies(id),
  service_location TEXT,
  bio TEXT,
  bio_ar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Client project requests
CREATE TABLE project_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  location_city TEXT,
  location_district TEXT,
  location_lat DECIMAL(10,7),
  location_lng DECIMAL(10,7),
  package_id INT REFERENCES service_packages(id),
  status request_status NOT NULL DEFAULT 'draft',
  floated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Services selected on a request
CREATE TABLE request_services (
  request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
  service_id INT NOT NULL REFERENCES engineering_services(id),
  PRIMARY KEY (request_id, service_id)
);

-- Request documents
CREATE TABLE request_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INT,
  mime_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agencies invited to quote on a request
CREATE TABLE request_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(id),
  invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  viewed_at TIMESTAMPTZ,
  UNIQUE (request_id, agency_id)
);

-- Quotations
CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
  agency_id UUID NOT NULL REFERENCES agencies(id),
  price DECIMAL(12,2) NOT NULL,
  scope TEXT,
  deliverables TEXT,
  timeline_days INT,
  payment_terms TEXT,
  status quotation_status NOT NULL DEFAULT 'draft',
  revision_number INT NOT NULL DEFAULT 1,
  submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agreements / PO from accepted quotation
CREATE TABLE agreements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID NOT NULL UNIQUE REFERENCES quotations(id),
  request_id UUID NOT NULL REFERENCES project_requests(id),
  agency_id UUID NOT NULL REFERENCES agencies(id),
  client_id UUID NOT NULL REFERENCES profiles(id),
  document_path TEXT,
  signed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Project milestones (traffic-light execution)
CREATE TABLE milestones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES project_requests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  status milestone_status NOT NULL DEFAULT 'amber',
  status_update TEXT, -- 7-8 word update
  due_date DATE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Manual payment tracking
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  request_id UUID NOT NULL REFERENCES project_requests(id),
  amount DECIMAL(12,2) NOT NULL,
  status payment_status NOT NULL DEFAULT 'pending',
  method TEXT,
  evidence_path TEXT,
  confirmed_at TIMESTAMPTZ,
  confirmed_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Finance Lite records
CREATE TABLE finance_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  record_type TEXT NOT NULL CHECK (record_type IN ('project_income', 'external_income', 'invoice', 'expense')),
  amount DECIMAL(12,2) NOT NULL,
  description TEXT,
  reference_id UUID,
  record_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit log
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_agencies_status ON agencies(status);
CREATE INDEX idx_project_requests_client ON project_requests(client_id);
CREATE INDEX idx_project_requests_status ON project_requests(status);
CREATE INDEX idx_quotations_request ON quotations(request_id);
CREATE INDEX idx_quotations_agency ON quotations(agency_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER agencies_updated_at BEFORE UPDATE ON agencies FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER project_requests_updated_at BEFORE UPDATE ON project_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER quotations_updated_at BEFORE UPDATE ON quotations FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER milestones_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER engineer_profiles_updated_at BEFORE UPDATE ON engineer_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role_value public.user_role;
  role_text TEXT;
BEGIN
  role_text := NEW.raw_user_meta_data->>'role';

  IF role_text IN (
    'client', 'agency_owner', 'agency_employee',
    'individual_engineer', 'finance_user', 'admin'
  ) THEN
    user_role_value := role_text::public.user_role;
  ELSE
    user_role_value := 'client';
  END IF;

  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    user_role_value
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$;

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON TABLE public.profiles TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE agreements ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update own profile; admins read all (is_admin added in 002/005)
CREATE POLICY profiles_select_own ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY profiles_update_own ON profiles FOR UPDATE USING (auth.uid() = id);

-- Public read for approved agencies (admin check via is_admin() in migration 002/005)
CREATE POLICY agencies_public_read ON agencies FOR SELECT USING (status = 'approved' OR owner_id = auth.uid());
CREATE POLICY agencies_owner_write ON agencies FOR ALL USING (owner_id = auth.uid());

-- Clients manage own requests (role checks via has_profile_role() in migration 002/005)
CREATE POLICY requests_client ON project_requests FOR ALL USING (client_id = auth.uid());
