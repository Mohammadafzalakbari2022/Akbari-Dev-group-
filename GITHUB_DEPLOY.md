# GitHub + Production Deploy Guide — Akbari Dev Group Hub

This guide walks you from the GitHub repository through **Supabase** (database, auth, storage) and **Render** (Next.js hosting). Use it after cloning:

**Repository:** https://github.com/Mohammadafzalakbari2022/Akbari-Dev-group-

**Clone (HTTPS):** `git clone https://github.com/Mohammadafzalakbari2022/Akbari-Dev-group-.git`

**Clone (SSH):** `git clone git@github.com:Mohammadafzalakbari2022/Akbari-Dev-group-.git`

**Default branch:** `master`

---

## Part A — Supabase setup (detailed)

### A.1 Create a Supabase project

1. Open [supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. Click **New project** (green button on the organization home or **Projects** list).
3. Choose your **Organization**, enter **Project name** (e.g. `akbari-dev-hub-prod`).
4. Pick a **Region** close to users (e.g. **South Asia (Mumbai)** `ap-south-1`).
5. Set a strong **Database password** and store it in a password manager.
6. Click **Create new project** and wait until the project status is **Active** (green).

### A.2 Collect environment variables (exact dashboard paths)

Open your project, then use the left sidebar **gear icon** → **Project Settings**.

#### Database URLs

1. Go to **Project Settings** → **Database**.
2. Scroll to **Connection string**.
3. Select **URI** tab.
4. For **Pooled connection** (Transaction mode), copy the URI on port **6543**. This becomes `DATABASE_URL`. Append `?pgbouncer=true` if it is not already present.
5. For **Direct connection**, copy the URI on port **5432**. This becomes `DIRECT_URL`.
6. Replace `[YOUR-PASSWORD]` in both strings with your database password.

| Variable | Menu path | Notes |
|----------|-----------|--------|
| `DATABASE_URL` | Settings → Database → Connection string → URI (pooler, **6543**) | Add `?pgbouncer=true` |
| `DIRECT_URL` | Settings → Database → Connection string → URI (direct, **5432**) | Used by Prisma migrations |

#### API keys

1. Go to **Project Settings** → **API**.
2. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`.
3. Under **Project API keys**, copy **anon** `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Copy **service_role** `secret` → `SUPABASE_SERVICE_ROLE_KEY` (server-only; never prefix with `NEXT_PUBLIC_`).

Optional keys (see `.env.example`): `RESEND_API_KEY`, `HESABPAY_MERCHANT_ID`, `HESABPAY_SECRET_KEY`.

### A.3 Local env file

From the repo root:

```bash
cp .env.example .env.local
```

Paste all Supabase values into `.env.local`. Do **not** commit this file (it is gitignored).

### A.4 Apply database schema

Install dependencies and push schema (first-time or dev):

```bash
npm install
npm run db:push
```

For production-style deploys, prefer migrations:

```bash
npm run db:migrate
```

**Alternative:** In Supabase **SQL Editor** (left sidebar → **SQL Editor** → **New query**), run the contents of `prisma/migrations/20250623000000_init/migration.sql`.

All `db:*` scripts load `.env.local` via `dotenv-cli`.

### A.5 Seed sample data

```bash
npm run db:seed
```

Seeds Khayat, StationPlus, hero, about, team, testimonials, reviews, guides, legal pages, and site settings.

### A.6 Storage bucket (media uploads)

**Dashboard:**

1. Left sidebar → **Storage**.
2. Click **New bucket**.
3. **Name:** `media`
4. Enable **Public bucket**.
5. Create the bucket.

**Or SQL:** run `supabase/storage.sql` in **SQL Editor**.

Admin uploads use `SUPABASE_SERVICE_ROLE_KEY` via `/api/upload`.

### A.7 Admin user (Supabase Auth)

1. Left sidebar → **Authentication** → **Users**.
2. Click **Add user** → **Create new user**.
3. Enter owner **Email** and **Password** (strong).
4. Confirm the user exists and is not banned.

**Email confirmation (recommended for dev):**

1. **Authentication** → **Providers** → **Email**.
2. Toggle **Confirm email** off for faster local testing (re-enable for production if you want verified emails).

### A.8 Auth URL configuration (production + Render)

After you know your Render URL or custom domain:

1. **Authentication** → **URL Configuration**.
2. **Site URL:** your canonical site (e.g. `https://akbari-dev-hub.onrender.com` or `https://yourdomain.com`).
3. **Redirect URLs:** add:
   - `https://<your-render-domain>/**`
   - `https://<your-custom-domain>/**` (if used)
   - `http://localhost:3000/**` (local dev)
4. Save.

Set `NEXT_PUBLIC_SITE_URL` in Render to the same canonical URL (sitemap, Open Graph).

### A.9 Verify Supabase locally

```bash
npm run dev
```

- Public site: http://localhost:3000/fa
- Admin login: http://localhost:3000/admin/login

---

## Part B — Render deploy (detailed)

### B.1 Create Web Service from GitHub

1. Push this repository to GitHub (see repo URL above).
2. Go to [dashboard.render.com](https://dashboard.render.com) and sign in with GitHub.
3. Click **New +** → **Web Service**.
4. Find and select **Akbari-Dev-group-** repository.
5. Configure:

| Setting | Value |
|---------|-------|
| **Name** | `akbari-dev-hub` |
| **Region** | Choose closest to your users |
| **Branch** | `master` |
| **Runtime** | **Node** |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm run start` |
| **Plan** | **Free** or **Starter** |

`npm run build` runs `prisma generate && next build --webpack` (webpack required for Serwist PWA).

### B.2 Environment variables (Render dashboard)

Before or after first deploy:

1. Open the Web Service on Render.
2. Go to **Environment** tab.
3. For each variable below, click **Add Environment Variable**, enter **Key** and **Value**.
4. Click **Save Changes**. The service will automatically redeploy.

| Key | Where you got it |
|-----|------------------|
| `DATABASE_URL` | Supabase → Settings → Database → pooler URI (6543) |
| `DIRECT_URL` | Supabase → Settings → Database → direct URI (5432) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role |
| `NEXT_PUBLIC_SITE_URL` | Your Render or custom domain (e.g. `https://akbari-dev-hub.onrender.com`) |
| `RESEND_API_KEY` | Resend dashboard (optional) |
| `HESABPAY_*` | HesabPay (optional) |

Never expose `SUPABASE_SERVICE_ROLE_KEY` as a `NEXT_PUBLIC_*` variable.

### B.3 Deploy

1. Click **Create Web Service** on the setup screen, or push to `master` to trigger a deployment.
2. Wait for **Build in progress** → **Live**.

### B.4 Post-deploy (production database)

Against production credentials (temporarily point `.env.local` at prod, or use Render's shell):

```bash
npm run db:migrate
npm run db:seed
```

Complete Supabase steps: **media** bucket, admin user, **Auth URL Configuration** (Part A.8).

### B.5 Custom domain (optional)

1. Render dashboard → **Web Service → Settings → Custom Domain**.
2. **Add** your domain and follow DNS instructions.
3. Update `NEXT_PUBLIC_SITE_URL` and Supabase **Site URL** / **Redirect URLs**.
4. The service redeploys automatically.

### B.6 Post-deploy verification URLs

Replace `<your-domain>` with your Render URL or custom domain:

| Check | URL |
|-------|-----|
| Dari homepage | `https://<your-domain>/fa` |
| Products | `https://<your-domain>/fa/products` |
| Admin login | `https://<your-domain>/admin/login` |
| Sitemap | `https://<your-domain>/sitemap.xml` |
| Robots | `https://<your-domain>/robots.txt` |
| PWA manifest | `https://<your-domain>/manifest.webmanifest` |

---

## Related documentation

- `DEPLOY.md` — architecture, troubleshooting, security checklist
- `README.md` — local quick start
- `supabase/README.md` — storage and RLS notes
