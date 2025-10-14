# E-Governance Whistleblower Portal (Prototype)

This repository contains a prototype implementation of an anonymous, city-aware whistleblower portal using Next.js App Router, Prisma (SQLite), JWT auth for admin, Resend for emails, and TailwindCSS for styling.

Key implemented pieces:

- Prisma schema (SQLite)
- Prisma client helper
- JWT auth helpers
- bcrypt password hashing
- File upload handling (formidable) with filename obfuscation
- API routes for anonymous report submission, report fetch by tracking ID, admin login, fetching reports, admin actions and admin creation
- Basic page skeletons for public and admin UI

Security notes:

- Do not store IPs or other identifiable data.
- Evidence filenames are HMAC-obfuscated before saving. For stronger security use AES encryption for file content and store keys securely (KMS/HSM).
- JWT stored in httpOnly cookie. Ensure HTTPS in production.
- Rate limiting and captcha should be added to `/api/report` to reduce spam.

Setup (local):

1. Install dependencies: npm install
2. Generate Prisma client: npx prisma generate
3. Run migrations (or create DB): npx prisma db push
4. Start dev server: npm run dev

Env vars to set in development (optional):

- JWT_SECRET
- RESEND_API_KEY
- EVIDENCE_HMAC_KEY

Next steps / improvements:

- Add tests and type definitions
- Implement frontend admin dashboard with report filters, escalation UI, and action uploads
- Add rate-limiting and captcha on report submissions
- Integrate AES encryption for file contents and secure key storage
