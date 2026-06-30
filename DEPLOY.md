# Deployment Guide — Akbari Dev Group Hub

Complete deployment instructions for **Render** (frontend) + **Supabase** (backend).

---

## Architecture

```
Browser → Render (Next.js 16) → Supabase PostgreSQL (Prisma)
                              → Supabase Auth (admin login)
                              → Supabase Storage (media uploads)
```

---

## Environment variables reference

| Variable | Required | Where used | Description |
|----------|----------|------------|-------------|
| `DATABASE_URL` | **Yes** | Prisma runtime | Pooled PostgreSQL URL (port 6543, `?pgbouncer=true`) |
| `DIRECT_URL` | **Yes** | Prisma migrations | Direct PostgreSQL URL (port 5432) |
| `NEXT_PUBLIC_SUPABASE_URL` | **Yes** | Client + middleware | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | **Yes** | Client + middleware | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Yes** | Server upload API | Service role key — **never expose to client** |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Sitemap, OG, metadata | Production domain (e.g. `https://akbaridev.com`) |
| `RESEND_API_KEY` | Optional | Contact email | Email notifications for form submissions |
| `HESABPAY_MERCHANT_ID` | Optional | Payments | HesabPay merchant ID |
| `HESABPAY_SECRET_KEY` | Optional | Payments | HesabPay API secret |

Copy `.env.example` to `.env.local` for local development. Use `.env.test.local` as a second template for test databases.

---

## Part 1 — Supabase (backend)

### 1.1 Create project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. **New project** → choose region (e.g. `ap-south-1` for South Asia)
3. Save the database password

### 1.2 Get credentials

**Project Settings → Database:**

- `DATABASE_URL` — Connection pooling URI, port **6543**, append `?pgbouncer=true`
- `DIRECT_URL` — Direct connection URI, port **5432**

**Project Settings → API:**

- `NEXT_PUBLIC_SUPABASE_URL` — Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — `anon` `public` key
- `SUPABASE_SERVICE_ROLE_KEY` — `service_role` key

### 1.3 Apply schema

From project root with `.env.local` configured (real Supabase values — placeholders will fail):

```bash
npm install
npm run db:migrate    # production (recommended)
# OR
npm run db:push       # quick first-time setup
```

> Database scripts load `.env.local` via `dotenv-cli`. Replace `[project-ref]` and `[YOUR-PASSWORD]` placeholders with your actual Supabase credentials.

Alternative: run `prisma/migrations/20250623000000_init/migration.sql` in Supabase SQL Editor.

### 1.4 Storage bucket

**Dashboard:** Storage → New bucket → name `media` → Public = ON

**Or SQL:** run `supabase/storage.sql` in SQL Editor.

### 1.5 Seed data

```bash
npm run db:seed
```

Creates Khayat, StationPlus, hero, about, team, testimonials, reviews, guides, legal pages, and site settings.

### 1.6 Admin user

1. **Authentication → Users → Add user**
2. Owner email + strong password
3. Disable email confirmation for dev: **Auth → Providers → Email**

### 1.7 RLS

- App data access goes through Next.js server (Prisma service connection) — no client-side DB queries
- Storage: public read on `media` bucket; uploads via service role in `/api/upload`
- See `supabase/storage.sql` for policy SQL

---

## Part 2 — Render (frontend)

### 2.1 Create Web Service

1. Push code to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com)
3. Click **New +** → **Web Service**
4. Connect your GitHub repository and select `Akbari-Dev-group-`
5. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `akbari-dev-hub` |
| **Region** | Closest to your users (e.g. Singapore) |
| **Branch** | `master` |
| **Runtime** | **Node** |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Plan** | Free or Starter |

Build runs `prisma generate && next build --webpack` (webpack required for Serwist PWA).

### 2.2 Environment variables

In **Dashboard → Web Service → Environment**, add all variables from the table above.

Set `NEXT_PUBLIC_SITE_URL` to your Render domain (e.g. `https://akbari-dev-hub.onrender.com`).

### 2.3 Deploy

Click **Create Web Service**. Render will build and deploy automatically. First deploy may succeed with empty data until you seed the production database.

### 2.4 Post-deploy checklist

```bash
# Against production DB (with prod env vars loaded)
npm run db:migrate
npm run db:seed
```

- [ ] Create admin user in Supabase Auth
- [ ] Create `media` Storage bucket
- [ ] Configure Supabase Auth URL Configuration (add your Render URL)
- [ ] Test `/fa`, `/fa/products`, `/admin/login`
- [ ] Verify `/sitemap.xml` and `/robots.txt`
- [ ] Test PWA install on mobile

### 2.5 Custom domain

1. Render **Dashboard → Web Service → Settings → Custom Domain**
2. Add your domain and configure DNS per Render instructions
3. Update `NEXT_PUBLIC_SITE_URL` to match
4. Update Supabase **Auth URL Configuration** with the new domain

### 2.6 Service Worker headers

Render's Free and Starter plans don't support custom response headers. The PWA service worker (`/sw.js`) is served with default cache headers, which may affect PWA update behavior. For full control, upgrade to a Render plan that supports custom headers or use a CDN in front of Render.

---

## Part 3 — Local testing (no Supabase yet)

The app runs without a database using mock data:

```bash
cp .env.example .env.local
# Leave placeholders OR fill in real Supabase values
npm install
npm run dev
```

Open http://localhost:3000/fa — shows mock Khayat/StationPlus, hero, testimonials.

With Supabase connected:

```bash
npm run db:push && npm run db:seed && npm run dev
```

---

## Quick command reference

```bash
# Development
npm run dev

# Production build (must pass with zero errors)
npm run build

# Lint
npm run lint

# Database
npm run db:push      # push schema
npm run db:migrate   # deploy migrations
npm run db:seed      # seed sample data
npm run db:studio    # Prisma Studio GUI
```

---

## Troubleshooting

### Build fails on Render

- Ensure all env vars are set in Render dashboard → Environment
- Check build logs for TypeScript errors: `npm run build` locally first
- Render free plan may timeout on large builds — consider a paid plan

### `P1001: Can't reach database server`

- Verify `DATABASE_URL` and `DIRECT_URL`
- Check Supabase project is not paused (free tier)
- Add Render's outbound IP to allowed list if using network restrictions

### Admin login redirects back to login

- Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` match your project
- User must exist in Supabase Auth and be confirmed
- Check **Auth URL Configuration** in Supabase — add your Render URL

### Products page shows mock data in production

- Database not connected or empty — run `npm run db:seed`
- Check `DATABASE_URL` in Render env vars

### Upload returns 503

- Set `SUPABASE_SERVICE_ROLE_KEY`
- Create `media` bucket in Storage

### Privacy/Terms pages 404

- Run seed or create `privacy` and `terms` pages in admin → Pages

### PWA not installing

- Requires HTTPS in production (Render provides this automatically)
- Check `/manifest.webmanifest` loads
- `public/sw.js` is generated at build time

---

## Security checklist

- [ ] Never commit `.env.local` or real keys (gitignored)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` only in server env (not `NEXT_PUBLIC_*`)
- [ ] Rotate keys if accidentally exposed
- [ ] Use strong admin password; enable 2FA when available

---

## Related files

| File | Purpose |
|------|---------|
| `.env.example` | Env var template |
| `.env.local` | Local secrets (gitignored) |
| `supabase/README.md` | Supabase-specific setup |
| `supabase/storage.sql` | Storage bucket + RLS |
| `prisma/schema.prisma` | Database schema |
| `prisma/seed.ts` | Sample data |
| `README.md` | Project overview + quick start |
