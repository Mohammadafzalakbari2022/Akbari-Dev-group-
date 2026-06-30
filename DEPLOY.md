# Deployment Guide — Akbari Dev Group Hub

Complete deployment instructions for **Vercel** (frontend) + **Supabase** (backend).

---

## Architecture

```
Browser → Vercel (Next.js 16) → Supabase PostgreSQL (Prisma)
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

Copy `.env.example` to `.env.local` for local development.

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

```bash
npm install
npm run db:migrate
```

### 1.4 Storage bucket

**Dashboard:** Storage → New bucket → name `media` → Public = ON

### 1.5 Seed data

```bash
npm run db:seed
```

### 1.6 Admin user

**Authentication → Users → Add user** → owner email + strong password.

### 1.7 Auth URL Configuration

**Authentication → URL Configuration** → add your Vercel URL to **Site URL** and **Redirect URLs**.

---

## Part 2 — Vercel (frontend)

### 2.1 Import repository

1. Push code to GitHub
2. [vercel.com/new](https://vercel.com/new) → Import `akbari-dev-hub`
3. Framework: **Next.js** (auto-detected)

### 2.2 Environment variables

In **Project Settings → Environment Variables**, add all variables from the table above for **Production**.

Set `NEXT_PUBLIC_SITE_URL` to your Vercel domain (e.g. `https://akbari-dev-hub.vercel.app`).

### 2.3 Build settings

| Setting | Value |
|---------|-------|
| Build command | `npm run build` |
| Output directory | `.next` (default) |
| Install command | `npm install` |
| Node.js version | 20.x |

### 2.4 Deploy

Click **Deploy**. The service worker headers are set automatically via `vercel.json`.

### 2.5 Post-deploy checklist

```bash
npm run db:migrate
npm run db:seed
```

- [ ] Create admin user in Supabase Auth
- [ ] Create `media` Storage bucket
- [ ] Configure Supabase Auth URL Configuration
- [ ] Test `/fa`, `/fa/products`, `/admin/login`
- [ ] Verify `/sitemap.xml` and `/robots.txt`
- [ ] Test PWA install on mobile

---

## Part 3 — Local testing

```bash
cp .env.example .env.local
npm install
npm run dev
```

---

## Quick command reference

```bash
npm run dev          # Development
npm run build        # Production build
npm run lint         # ESLint
npm run db:migrate   # Deploy migrations
npm run db:seed      # Seed sample data
npm run db:studio    # Prisma Studio
```

---

## Troubleshooting

### Build fails on Vercel

- Ensure all env vars are set (build needs `DATABASE_URL` for `prisma generate`)
- Check build logs for TypeScript errors: `npm run build` locally first

### `P1001: Can't reach database server`

- Verify `DATABASE_URL` and `DIRECT_URL`
- Check Supabase project is not paused

### Admin login redirects back to login

- Confirm `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` match your project
- Add your Vercel URL to **Auth → URL Configuration**

### Products page shows mock data in production

- Database not connected — run `npm run db:seed`

### PWA not installing

- Requires HTTPS (Vercel provides this)
- `vercel.json` sets required `Service-Worker-Allowed` header

---

## Related files

| File | Purpose |
|------|---------|
| `.env.example` | Env var template |
| `vercel.json` | Vercel headers (PWA) |
| `supabase/storage.sql` | Storage bucket + RLS |
| `prisma/schema.prisma` | Database schema |
| `prisma/seed.ts` | Sample data |
