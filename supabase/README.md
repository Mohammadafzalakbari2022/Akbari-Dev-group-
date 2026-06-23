# Supabase backend setup for Akbari Dev Hub

This folder contains SQL and CLI instructions for deploying the backend to [Supabase](https://supabase.com). The app uses **Prisma** for schema management and **Supabase Auth + Storage** for admin login and media uploads.

## Prerequisites

- A Supabase project ([dashboard](https://supabase.com/dashboard))
- Node.js 20+ with project dependencies installed (`npm install`)
- Environment variables in `.env.local` (see `.env.example`)

> **Note:** Supabase MCP and Supabase CLI were not available in the build environment. Run the steps below on your machine with your connected Supabase project.

## 1. Configure environment

Copy `.env.example` to `.env.local` and fill in:

| Variable | Source |
|----------|--------|
| `DATABASE_URL` | Database → Connection string → URI (pooler, port **6543**, add `?pgbouncer=true`) |
| `DIRECT_URL` | Database → Connection string → URI (direct, port **5432**) |
| `NEXT_PUBLIC_SUPABASE_URL` | API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | API → `anon` public key |
| `SUPABASE_SERVICE_ROLE_KEY` | API → `service_role` key (server-only) |

## 2. Apply database schema

**Option A — Prisma migrate (recommended for production):**

```bash
npm run db:migrate
```

**Option B — Prisma db push (quick dev setup):**

```bash
npm run db:push
```

**Option C — Raw SQL (Supabase SQL Editor):**

Run `prisma/migrations/20250623000000_init/migration.sql` in the Supabase SQL Editor.

## 3. Create Storage bucket

In **Storage → New bucket**:

- Name: `media`
- Public bucket: **ON**

Or run `supabase/storage.sql` in the SQL Editor for bucket + RLS policies.

## 4. Seed sample data

```bash
npm run db:seed
```

Seeds Khayat, StationPlus, hero, about pages, team, testimonials, reviews, guides, and site settings.

## 5. Create admin user

1. **Authentication → Users → Add user**
2. Enter owner email + password
3. For local dev, disable email confirmation: **Auth → Providers → Email → Confirm email** off

## 6. Verify

```bash
npm run dev
```

- Public: http://localhost:3000/fa
- Admin: http://localhost:3000/admin/login

## RLS notes

Prisma connects with the database service role connection string, bypassing RLS. Public site reads go through Next.js server components and API routes — not direct client DB access.

Storage bucket `media` uses public read policies (see `storage.sql`). Writes require `SUPABASE_SERVICE_ROLE_KEY` via `/api/upload`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `P1001` can't reach database | Check `DATABASE_URL` / `DIRECT_URL`; allow your IP in Supabase network settings |
| Prisma migrate fails on pooler | Use `DIRECT_URL` for migrations (`directUrl` in `schema.prisma`) |
| Admin login fails | Confirm user exists in Supabase Auth; check `NEXT_PUBLIC_SUPABASE_*` keys |
| Upload fails | Create `media` bucket; set `SUPABASE_SERVICE_ROLE_KEY` |
| Empty public site after seed | Re-run `npm run db:seed`; confirm products have `status: published` |
