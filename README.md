# MUHAMI.guru — Coming Soon Landing Page

React + Vite frontend with **Supabase PostgreSQL** database and **Supabase Edge Function** API.

## Architecture

```
Landing page (Vite)  →  Supabase Edge Function (muhami-api)  →  PostgreSQL (lawyer_applications)
Admin panel (/admin) →  same API
```

## Setup

```bash
npm install
cp .env.example .env   # already configured if cloned with .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**No local API server required** — the frontend talks directly to the deployed Supabase Edge Function.

Optional local API: `npm run dev:api` (needs `SUPABASE_SERVICE_ROLE_KEY` in `.env`)

## Environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Edge function lawyers endpoint |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key (public, for API calls) |
| `SUPABASE_SERVICE_ROLE_KEY` | Only for optional local `server.ts` |

## Admin panel

[http://localhost:5173/admin](http://localhost:5173/admin)

- **Username:** `admin`
- **Password:** `admin`

(Change credentials in **Supabase → Edge Functions → muhami-api → Secrets** before launch.)

See [DEPLOY.md](./DEPLOY.md) for Vercel + domain setup.

## API endpoints (Edge Function)

Base: `https://uhhobtdwixfeqmpnbjbu.supabase.co/functions/v1/muhami-api`

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/lawyers` | Submit lawyer application |
| `POST` | `/admin/login` | Admin sign-in |
| `GET` | `/lawyers` | List applications (`x-admin-key` header) |
| `GET` | `/health` | Health check |

## Database

Table: `public.lawyer_applications`  
View data: **Supabase Dashboard → Table Editor**

Migration: `supabase/migrations/001_lawyer_applications.sql`  
Edge function source: `supabase/functions/muhami-api/index.ts`

## Build & deploy frontend

```bash
npm run build
```

Deploy `dist/` to Vercel with the same `VITE_*` env vars.
