# Akbari Dev Group — Developer Hub

Trilingual (Dari default, Pashto, English) personal developer hub for **Akbari Dev Group**. Built with Next.js 16 App Router, Tailwind CSS 4, next-intl, next-themes, Prisma, and Supabase.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- npm 10+
- [Supabase](https://supabase.com/) account (database, auth, storage)
- [Vercel](https://vercel.com/) account (deployment)

## Quick start (local)

```bash
npm install
cp .env.example .env.local
# Fill in Supabase + database URLs (see below)
npm run db:push
npm run db:seed
npm run dev
```

> `db:*` scripts load `.env.local` automatically. The app also runs without a database using mock data.

Open [http://localhost:3000](http://localhost:3000) — redirects to `/fa` (Dari, default locale).

### Locales

| Code | Language | Direction |
|------|----------|-----------|
| `fa` | Dari (دری) | RTL |
| `ps` | Pashto (پښتو) | RTL |
| `en` | English | LTR |

---

## 1. Create a Supabase project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Choose a region close to your users (e.g. `ap-south-1` for South Asia)
3. Save the database password securely

### Get connection strings

**Project Settings → Database:**

| Variable | Where to copy |
|----------|---------------|
| `DATABASE_URL` | Connection string → **URI** with `?pgbouncer=true` (port 6543, pooled) |
| `DIRECT_URL` | Connection string → **URI** direct (port 5432) |

**Project Settings → API:**

| Variable | Where to copy |
|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (server-only, never expose to client) |

Paste all values into `.env.local`.

### Create Storage bucket (for admin uploads)

1. **Storage → New bucket** → name: `media`
2. Set **Public bucket** = ON (or configure RLS policies for public read)
3. Allowed MIME types: `image/*`, `application/pdf` (optional)

Uploads fall back to manual URL entry if Storage is not configured.

---

## 2. Apply database schema

```bash
# Push Prisma schema to Supabase PostgreSQL
npm run db:push

# Or deploy SQL migration
npm run db:migrate
```

Generate Prisma client (runs automatically on build):

```bash
npm run db:generate
```

### Seed sample data

```bash
npm run db:seed
```

Seeds Khayat + StationPlus products, team, hero settings, testimonials, and global contact/social links.

---

## 3. Create owner admin user

The `/admin` dashboard uses **Supabase Auth** (email + password).

1. **Authentication → Users → Add user**
2. Enter your email and a strong password
3. Confirm the user (disable email confirmation in dev: **Auth → Providers → Email → Confirm email** off)

Admin routes are protected by middleware — only authenticated Supabase users can access `/admin/*`.

> In local dev without Supabase configured, admin forms work with a stub `dev@local` session.

---

## 4. Environment variables

Copy `.env.example` to `.env.local`:

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes (prod) | Supabase pooled PostgreSQL URL |
| `DIRECT_URL` | Yes (prod) | Direct PostgreSQL URL for migrations |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (prod) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (prod) | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (uploads) | Service role key for Storage uploads |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Production URL for sitemap/OG (e.g. `https://akbaridev.com`) |

The app builds without credentials — public pages show empty/placeholder states until the database is configured.

---

## 5. Deploy to Vercel

### Connect repository

1. Push code to GitHub
2. [vercel.com/new](https://vercel.com/new) → Import repository
3. Framework preset: **Next.js** (auto-detected)

### Set environment variables

In **Project Settings → Environment Variables**, add all variables from `.env.local` for **Production**.

Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain (e.g. `https://akbari-dev-hub.vercel.app`).

### Build settings

Default build command works — runs `prisma generate && next build --webpack` (webpack required for Serwist PWA service worker).

### Post-deploy checklist

- [ ] Run `npm run db:migrate` against production DB (or `db:push` once)
- [ ] Run `npm run db:seed` (first deploy only)
- [ ] Create admin user in Supabase Auth
- [ ] Create `media` Storage bucket
- [ ] Configure Supabase Auth URL Configuration (add your Vercel URL)
- [ ] Test `/fa`, `/admin/login`, PWA install on mobile
- [ ] Verify `/sitemap.xml` and `/robots.txt`

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build (Prisma + webpack for PWA) |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:migrate` | Deploy migrations |
| `npm run db:seed` | Seed sample data |
| `npm run db:studio` | Open Prisma Studio |

---

## Project structure

```
src/
├── app/
│   ├── [locale]/          # Public pages (fa, ps, en)
│   ├── admin/             # Owner-only CMS
│   ├── api/               # Contact, download, upload, analytics
│   ├── manifest.ts        # PWA manifest
│   ├── sitemap.ts         # Dynamic sitemap
│   └── robots.ts          # Robots.txt
├── components/
│   ├── hero/              # Aurora hero + orbit cards
│   ├── home/              # Homepage sections + testimonials
│   ├── products/          # Catalog, detail, report problem
│   ├── layout/            # Navbar, footer, social strip
│   ├── payments/          # HesabPay + ATOMA Pay
│   └── admin/             # CMS editors
├── lib/                   # Prisma, Supabase, SEO helpers
└── messages/              # fa.json, ps.json, en.json
prisma/
├── schema.prisma
├── seed.ts
└── migrations/
public/
├── icons/                 # PWA icons
└── sw.js                  # Generated service worker (build)
```

---

## Features (v1)

- Trilingual RTL-first public site with dark/light/system theme
- Product catalog with search, filters, download proxy, QR codes
- Per-product support/pricing, social strip, problem reports
- HesabPay + ATOMA Pay (dashboard-configured, hidden when empty)
- Curated testimonials on homepage
- Owner CMS at `/admin` — products, pages, team, settings, contact inbox, analytics
- PWA installable on mobile (Serwist service worker)
- SEO: per-locale metadata, Open Graph, sitemap, JSON-LD

---

## License

Private — Akbari Dev Group

---

## Deployment

See **[DEPLOY.md](./DEPLOY.md)** for the complete Vercel + Supabase deployment guide, env var reference, troubleshooting, and post-deploy checklist.
