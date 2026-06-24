# Deploy MUHAMI.guru to your domain

## Do you need a separate server?

**No.** You do not need VPS, Railway, or a Node server.

| What | Where it runs |
|------|----------------|
| Website (React) | **Vercel** or **Netlify** (free) |
| API (form + admin) | **Supabase Edge Function** (already deployed) |
| Database | **Supabase PostgreSQL** (already connected) |

Supabase handles backend + database. You only deploy the static frontend.

---

## Step 1 — Deploy frontend to Vercel

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import repo
3. Set **Environment Variables**:

```
VITE_API_URL=https://uhhobtdwixfeqmpnbjbu.supabase.co/functions/v1/muhami-api/lawyers
VITE_SUPABASE_ANON_KEY=<from Supabase Dashboard → Settings → API → anon key>
```

4. Deploy — Vercel uses `vercel.json` for `/admin` routing

---

## Step 2 — Connect your domain

In **Vercel → Project → Settings → Domains**:

- Add `muhami.guru`
- Add `www.muhami.guru` (optional, redirect to root)

Vercel shows DNS records. At your domain registrar (GoDaddy, Namecheap, etc.):

| Type | Name | Value |
|------|------|-------|
| `A` | `@` | `76.76.21.21` (Vercel IP — check Vercel dashboard) |
| `CNAME` | `www` | `cname.vercel-dns.com` |

DNS can take up to 48 hours (usually minutes).

---

## Step 3 — Update Supabase CORS (already done)

Edge function allows:
- `https://muhami.guru`
- `https://www.muhami.guru`
- `http://localhost:5173`
- `https://*.vercel.app` (preview deployments)

---

## Step 4 — Change admin password before launch

In Supabase Dashboard → **Edge Functions → muhami-api → Secrets**, set:

```
ADMIN_USERNAME=your-username
ADMIN_PASSWORD=your-strong-password
ADMIN_API_KEY=long-random-string
```

Redeploy or secrets apply automatically.

---

## URLs after launch

| Page | URL |
|------|-----|
| Landing | `https://muhami.guru` |
| Admin | `https://muhami.guru/admin` |
| API | `https://uhhobtdwixfeqmpnbjbu.supabase.co/functions/v1/muhami-api` |

---

## Optional: local development

```bash
npm run dev
```

No local API server required.
