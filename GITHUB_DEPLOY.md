# GitHub + Production Deploy Guide — Akbari Dev Group Hub

Deploy from GitHub through **Supabase** (database, auth, storage) and **Vercel** (Next.js hosting).

**Repository:** https://github.com/Mohammadafzalakbari2022/Akbari-Dev-group-

---

## Part A — Supabase setup

### A.1 Create project

[supabase.com/dashboard](https://supabase.com/dashboard) → **New project**

### A.2 Collect environment variables

**Project Settings → Database:** `DATABASE_URL` (pooler, port 6543) + `DIRECT_URL` (direct, port 5432)

**Project Settings → API:** `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` + `SUPABASE_SERVICE_ROLE_KEY`

### A.3 Apply schema

```bash
npm install
npm run db:migrate
```

### A.4 Seed data

```bash
npm run db:seed
```

### A.5 Storage bucket

**Storage → New bucket** → name `media` → Public = ON

### A.6 Admin user

**Authentication → Users → Add user**

### A.7 Auth URL Configuration

**Authentication → URL Configuration** → add your Vercel URL to redirect URLs.

---

## Part B — Vercel deploy

### B.1 Import from GitHub

1. Push to GitHub
2. [vercel.com/new](https://vercel.com/new) → Import repo
3. Framework: **Next.js**

### B.2 Environment variables

Add all variables from the table below in **Vercel → Project Settings → Environment Variables**.

| Key | Source |
|-----|--------|
| `DATABASE_URL` | Supabase → Database → pooler URI (6543) |
| `DIRECT_URL` | Supabase → Database → direct URI (5432) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → API → service_role |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel domain |

### B.3 Deploy

Click **Deploy**. PWA headers are set via `vercel.json`.

### B.4 Post-deploy

```bash
npm run db:migrate
npm run db:seed
```

---

## Related docs

- `DEPLOY.md` — full guide with troubleshooting
- `README.md` — local quick start
