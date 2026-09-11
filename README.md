# Jaipur Market — Phase 1

A real, deployable e-commerce app built as a single Next.js project
(App Router). Phase 1 covers: database schema and authentication
(register, login, logout, session management).

## Stack

- **Next.js 14** (App Router) — frontend + backend (API routes) in one app
- **PostgreSQL** via Prisma — use [Supabase](https://supabase.com) or [Neon](https://neon.tech) (both have free tiers, browser-based setup)
- **Argon2id** password hashing
- **jose** for signed session tokens (JWT), backed by a DB `Session` table so sessions can be revoked
- Deploy target: **Vercel** (free tier, connects directly to GitHub)

## What's built in Phase 1

- `prisma/schema.prisma` — full data model: users/auth, customers, products,
  variants, categories, inventory, cart, orders, payments, discounts,
  reviews, wishlist, audit log
- `src/lib/password.ts` — Argon2id hash/verify
- `src/lib/auth.ts` — session creation, secure HttpOnly cookies, revocation
- `src/lib/validation.ts` — Zod input validation
- `src/lib/rate-limit.ts` — brute-force protection on auth endpoints
- API routes: `POST /api/auth/register`, `POST /api/auth/login`,
  `POST /api/auth/logout`, `GET /api/auth/me`

## Getting started (from your phone, step by step)

1. **Create a free Postgres database**
   - Go to supabase.com → New Project → copy the "Connection string" (URI, with password)
2. **Push this code to GitHub**
   - Create a new repo, upload this folder (GitHub's web uploader works fine, or the GitHub mobile app)
3. **Deploy on Vercel**
   - vercel.com → New Project → Import your GitHub repo
   - In "Environment Variables", add everything from `.env.example` with real values
     - `DATABASE_URL` → your Supabase connection string
     - `SESSION_SECRET` → any random 32+ character string
   - Deploy
4. **Run the database migration**
   - Easiest from phone: Supabase has a SQL editor in its dashboard —
     we'll generate the SQL for you to paste in, or in a later phase we
     can set up a GitHub Action that runs `prisma migrate deploy`
     automatically on every push.

## Next phases (not built yet)

- Phase 2: Product catalog admin (create/edit products, categories, images)
- Phase 3: Storefront pages (browse, product detail, search)
- Phase 4: Cart + checkout
- Phase 5: Razorpay payment integration + COD
- Phase 6: Order management + status tracking
- Phase 7: Discounts, reviews, wishlist
- Phase 8: Admin dashboard, analytics
- Phase 9: SEO, theme/homepage builder
- Phase 10: Testing, security review, backups, production launch checklist

## Security notes

- Passwords are never stored in plaintext (Argon2id only)
- Sessions are DB-backed, so "log out everywhere" is possible
- Login/register endpoints are rate-limited per IP and per email
- Login response timing is equalized for "no such user" vs "wrong password" to prevent email enumeration
- Secrets only ever live in environment variables, never in code
