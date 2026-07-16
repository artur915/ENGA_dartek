# ENGA — Engineering Services Marketplace MVP

A bilingual (Arabic/English) marketplace connecting clients with licensed engineering offices in Saudi Arabia.

## Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** Supabase (Auth, PostgreSQL, Storage, RLS)
- **i18n:** next-intl with full RTL support for Arabic

## Project Structure

```
enga-platform/
├── src/
│   ├── app/[locale]/     # Localized routes (en, ar)
│   ├── components/       # UI components
│   ├── data/catalog.ts   # 147 services from Excel (auto-generated)
│   ├── i18n/             # Internationalization config
│   └── lib/supabase/     # Supabase client utilities
├── supabase/migrations/  # Database schema
├── messages/             # en.json, ar.json translations
└── requirement/          # Original project documents (parent folder)
```

## Roles & Portals

| Role | Portal | Wireframe |
|------|--------|-----------|
| Client / Homeowner | `/client` | ENGA 1.pdf |
| Engineering Office | `/agency` | ENGA 2.pdf |
| Individual Engineer | `/engineer` | ENGA 3.pdf |

## MVP Workflow

Submit Request → Float to Agencies → Compare Quotations → Sign Agreement/PO → Traffic-Light Execution → Manual Payment → Close & Archive

## Service Catalog

- **147 services** across **10 categories**
- **7 homeowner packages:** Build My Villa, Design to Permit, Fast Permit, Renovate & Expand, Legalize My Building, Design Studio, Standalone/Add-on

## Getting Started

See **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** for full database setup instructions.

```bash
cd enga-platform
cp .env.local.example .env.local
# Add your Supabase credentials, then run migrations in SQL Editor

npm install
npm run dev
```

### Quick Supabase Setup

1. Create project at [supabase.com](https://supabase.com)
2. Run migrations `001`, `002`, `003` in SQL Editor (in order)
3. Set env vars in `.env.local`
4. Promote your user to admin: `UPDATE profiles SET role = 'admin' WHERE email = 'you@email.com';`

## Sprint Plan (from Technical Proposal)

| Sprint | Week | Focus |
|--------|------|-------|
| 1 ✅ | 1 | UI foundation, auth, roles, bilingual/RTL, service catalog |
| 2 | 2 | Agency profiles, admin approval, document storage |
| 3 | 3 | Client requests, floating, quotation submission |
| 4 | 4 | Quote comparison, agreements, notifications |
| 5 | 5 | Milestones, payments, closure & archive |
| 6 | 6 | Finance Lite, QA, production deployment |

## Deferred (Post-Launch)

- Government API integrations
- Payment gateway
- Advanced AI features
- Full accounting / ERP
