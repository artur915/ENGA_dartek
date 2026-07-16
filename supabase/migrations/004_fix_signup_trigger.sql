-- Fix signup 500: profile trigger blocked by RLS
-- Run this in Supabase SQL Editor if signup returns 500

-- Drop and recreate trigger function with correct security settings
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
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    updated_at = NOW();

  RETURN NEW;
END;
$$;

-- Ensure auth admin can run the trigger and write profiles
GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT ALL ON TABLE public.profiles TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO supabase_auth_admin;

-- Allow profile creation during signup (auth trigger has no auth.uid() yet)
DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
DROP POLICY IF EXISTS profiles_insert_signup ON public.profiles;

CREATE POLICY profiles_insert_signup ON public.profiles
  FOR INSERT
  TO supabase_auth_admin
  WITH CHECK (true);

CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Recreate trigger (safe if already exists)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
