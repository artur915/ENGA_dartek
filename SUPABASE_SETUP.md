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

In the Supabase SQL Editor, run these files **in order** (paste file **contents**, not the file path):

1. `supabase/migrations/001_initial_schema.sql` — tables, triggers, base RLS
2. `supabase/migrations/002_rls_and_storage.sql` — complete RLS, storage buckets, RPC functions
3. `supabase/migrations/003_seed_catalog.sql` — 147 services, 7 packages, 10 categories
4. `supabase/migrations/004_fix_signup_trigger.sql` — fixes signup 500 (profile trigger + RLS)
5. `supabase/migrations/005_fix_profiles_rls_recursion.sql` — fixes "infinite recursion" on profiles when floating requests
6. `supabase/migrations/006_fix_project_requests_rls_recursion.sql` — fixes "infinite recursion" on project_requests when floating requests

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

Open http://localhost:3000/en

## End-to-End Test Flow

1. **Admin**: Sign up → run SQL to set role = admin → go to `/en/admin` → approve agencies
2. **Agency**: Sign up as agency_owner → `/en/agency/register` → submit office → wait for admin approval
3. **Client**: Sign up as client → `/en/client/requests/new` → create, upload docs, float request
4. **Agency**: `/en/agency/requests` → view request → submit quotation
5. **Client**: `/en/client/quotations` → compare quotes → accept → redirected to project workspace
6. **Both**: `/en/client/projects/[id]` or `/en/agency/projects/[id]` → milestones, payments, complete, archive
7. **Agency**: `/en/agency/finance` → Finance Lite dashboard

## Storage Buckets

Created automatically by migration 002:
- `request-documents` — client project uploads (PDF, images, DWG)
- `agency-documents` — CR, license files

## RPC Functions

- `float_project_request(request_id)` — floats request and invites all approved agencies
- `accept_quotation(quotation_id)` — accepts quote, rejects others, creates agreement

## Deploying to Vercel

1. In Vercel → **Project Settings → Environment Variables**, add:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_PROJECT.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon public key from Supabase → Settings → API |

2. Enable for **Production**, **Preview**, and **Development**.

3. **Redeploy** after adding variables (required for `NEXT_PUBLIC_*` vars to be embedded in the client bundle).

4. In Supabase → **Authentication → URL Configuration**, add your Vercel URL to **Site URL** and **Redirect URLs**:
   - `https://your-app.vercel.app`
   - `https://your-app.vercel.app/auth/callback`

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Signup returns 500 | Run migration `004_fix_signup_trigger.sql` |
| Infinite recursion on profiles | Run migration `005_fix_profiles_rls_recursion.sql` |
| Infinite recursion on project_requests | Run migration `006_fix_project_requests_rls_recursion.sql` |
| Sign-in returns 400 | Confirm email or disable email confirmation in Supabase Auth |
| Missing env vars | Create `.env.local` and restart dev server |
