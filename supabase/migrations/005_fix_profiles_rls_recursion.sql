-- Fix: infinite recursion detected in policy for relation "profiles"
-- Cause: profiles SELECT policy queried profiles again to check admin role.
-- Run in Supabase SQL Editor after migrations 001–004.

-- Helper functions bypass RLS (SECURITY DEFINER) so policies never recurse into profiles.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.has_profile_role(roles public.user_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = ANY (roles)
  );
$$;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_profile_role(public.user_role[]) TO authenticated, anon;

-- Remove split admin policies if present (from updated 002)
DROP POLICY IF EXISTS profiles_select_admin ON public.profiles;
DROP POLICY IF EXISTS agencies_admin_read ON public.agencies;
DROP POLICY IF EXISTS requests_staff ON public.project_requests;

-- Profiles: read own row; admins read all (via is_admin(), not inline subquery)
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- Agencies: replace inline profiles subquery
DROP POLICY IF EXISTS agencies_public_read ON public.agencies;
CREATE POLICY agencies_public_read ON public.agencies
  FOR SELECT
  USING (
    status = 'approved'
    OR owner_id = auth.uid()
    OR public.is_admin()
  );

-- Project requests: replace inline profiles subquery (triggered on float/update)
DROP POLICY IF EXISTS requests_client ON public.project_requests;
CREATE POLICY requests_client ON public.project_requests
  FOR ALL
  USING (client_id = auth.uid() OR public.is_admin())
  WITH CHECK (client_id = auth.uid() OR public.is_admin());
