# Supabase Setup Guide

Run these steps once to connect the ENGA platform to Supabase.

## 1. Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and create a new project
2. Copy your **Project URL** and **anon public key** from Settings → API

## 2. Configure Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Run Database Migrations

In the Supabase SQL Editor, run these files **in order**:

1. `supabase/migrations/001_initial_schema.sql` — tables, triggers, base RLS
2. `supabase/migrations/002_rls_and_storage.sql` — complete RLS, storage buckets, RPC functions
3. `supabase/migrations/003_seed_catalog.sql` — 147 services, 7 packages, 10 categories

## 4. Create Admin User

After signing up your first account, promote it to admin in SQL Editor:

```sql
UPDATE profiles SET role = 'admin' WHERE email = 'your@email.com';
```

## 5. Disable Email Confirmation (optional, for dev)

In Supabase Dashboard → Authentication → Providers → Email:
- Turn off "Confirm email" for faster local testing

## 6. Start the App

```bash
npm run dev
```

## End-to-End Test Flow

1. **Admin**: Sign up → run SQL to set role = admin → go to `/en/admin` → approve agencies
2. **Agency**: Sign up as agency_owner → `/en/agency/register` → submit office → wait for admin approval
3. **Client**: Sign up as client → `/en/client/requests/new` → create & float request
4. **Agency**: `/en/agency/requests` → view request → submit quotation
5. **Client**: `/en/client/requests` → Compare Quotations → accept quote
6. **Client**: `/en/client/projects` → see signed agreement

## Storage Buckets

Created automatically by migration 002:
- `request-documents` — client project uploads
- `agency-documents` — CR, license files

## RPC Functions

- `float_project_request(request_id)` — floats request and invites all approved agencies
- `accept_quotation(quotation_id)` — accepts quote, rejects others, creates agreement
