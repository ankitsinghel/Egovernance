# E-Governance — Whistleblower Platform

This repository is a full-stack prototype of a secure, auditable whistleblower platform built with Next.js (App Router), TypeScript, Prisma and Supabase. The system enables anonymous report submission, secure attachment handling, per-action audit logs, and role-based admin panels for triage and investigation.

The project is intentionally modular and production-minded: it centralizes domain logic (statuses, types, zod schemas), enforces server-side validation, and keeps audit trails for all administrative actions.

Key features

- Anonymous reporting with evidence uploads and metadata removal
- Unique, unguessable tracking IDs for public report tracking pages
- Audit-grade ActionLog entries for every admin action (actor id/role, note, optional proof file, numeric statusChange)
- Role-based admin hierarchy: Super‑Admin, State‑Admin, Admin with server‑enforced permissions
- Session-based authentication: OTP + short-lived JWT stored in HTTP‑only cookies and validated on the server
- File storage using Supabase Storage with signed time-limited URLs for secure access
- App Router server components + shadcn UI primitives; forms use react-hook-form + zod for consistent validation


Important notes about migrations and schema

- Prisma schema in `prisma/schema.prisma` is the source of truth for the client. Use `npx prisma generate` after updating the schema.

Security & privacy guidance

- Do not log or persist reporter-identifying data (IP addresses, device fingerprints) unless explicitly required and authorized.
- Evidence filenames are obfuscated; for stronger protection consider encrypting file contents and storing keys in a managed KMS.
- JWTs are stored in httpOnly cookies. Ensure HTTPS and secure cookie flags in production.


Quickstart (local dev)

1. Install dependencies

```powershell
npm install
```

2. Create / configure your database

- The project targets Postgres (Supabase) for production. Set `DATABASE_URL` accordingly when running locally.
- If you need to use SQLite for quick local dev, update `prisma/schema.prisma` and follow Prisma docs — but be careful: migrations in this repo were applied using raw SQL to preserve history.

3. Generate Prisma client

```powershell
npx prisma generate
```

4. Start the dev server

```powershell
npm run dev
```



Recommended environment variables

- `DATABASE_URL` — Postgres connection string (required for production / Supabase)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase URL (if using Supabase features client-side)
- `SUPABASE_SERVICE_ROLE_KEY` — Supabase service role key for server operations (keep secret)
- `JWT_SECRET` — secret for signing JWTs
- `EVIDENCE_HMAC_KEY` — key used to HMAC/obfuscate evidence filenames
- `RESEND_API_KEY` — (optional) API key for Resend email service
- `PRISMA_QUERY_LOG` — set to `true` to enable Prisma SQL logging in dev

Notes about admin signup

- The app intentionally does not expose a public admin self-signup flow. Administrator accounts are created by the Super‑Admin only. The earlier `app/admin/signup` UI has been removed; Super‑Admin signup and verification flows remain.

Project layout (high level)

- `app/` — Next.js App Router pages and route handlers
  - `(main)` — public site pages (home, report, track) — the footer is injected into this layout only
  - `admin/` — admin login & dashboards (scoped by role)
  - `api/` — server route handlers (reports, actions, auth, metrics, etc.)
- `components/` — UI components (shadcn primitives, footer, homeRoute pieces, drawers)
- `lib/` — shared helpers: `db.ts` (Prisma client), `auth.ts`, `schemas.ts` (zod), `statuses.ts`, types, utils
- `prisma/` — Prisma schema and migrations (manual SQL migration scripts included in `scripts/`)

Performance notes & suggestions

- Consider caching read-mostly pages (home, public tracking) with Next.js revalidate (ISR) or an HTTP cache-control header.
- Use Redis for expensive aggregations and invalidate cache on writes that affect data.
- Add DB indexes (trackingId, status, stateId, createdAt) and use Prisma selects to limit returned fields.
- Dynamic import heavy admin-only components to reduce initial client bundle.

How to contribute

1. Fork the repo and create a feature branch.
2. Keep changes small and focused, run type-check and tests locally:

```powershell
npx tsc --noEmit
```

3. Open a pull request with a clear description of the change and relevant screenshots / metrics.


If you need help running the project or want consulting for production hardening, open an issue or contact the maintainer.

Repository: https://github.com/ankitsinghel/Egovernance
