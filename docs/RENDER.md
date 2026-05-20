# Deploy **AlumPlus-api** on Render

Repo: `https://github.com/jadaan96/AlumPlus-api`

## 1) Create a PostgreSQL database

1. In [Render Dashboard](https://dashboard.render.com) click **New +** → **PostgreSQL**.
2. Choose a name, region, plan (Free is OK for testing).
3. Click **Create Database**.
4. After it is ready, open the database → **Connections** → copy the **External Database URL** (starts with `postgresql://…`).  
   You will use this as `DATABASE_URL` on the web service.

## 2) Create a Web Service (Node API)

1. **New +** → **Web Service**.
2. Connect **GitHub** and select **`jadaan96/AlumPlus-api`**.
3. Settings:
   - **Name:** anything (e.g. `alum-plus-api`)
   - **Region:** same as the database if possible
   - **Branch:** `main`
   - **Root directory:** leave **empty** (repo root is already the API)
   - **Runtime:** `Node`
   - **Node version:** `22` (repo includes `.node-version`; or set env **`NODE_VERSION`** = `22` under Environment — required for Prisma 6)
   - **Build command:**  
     `npm install && npm run build`
   - **Start command:**  
     `npm run start:prod`  
     (runs `prisma migrate deploy` then `node dist/index.js`)

## 3) Environment variables

In the Web Service → **Environment** → add:

| Key | Value |
|-----|--------|
| `DATABASE_URL` | Paste the **External** Postgres URL from step 1 |
| `JWT_ACCESS_SECRET` | Long random string (32+ chars) |
| `JWT_REFRESH_SECRET` | Different long random string |
| `CORS_ORIGIN` | Your Netlify URL **exactly**, e.g. `https://your-site.netlify.app` (no trailing `/`; comma‑separate if multiple). If wrong, the browser blocks login from the site. |
| `NODE_ENV` | `production` |
| `TRUST_PROXY` | `1` (recommended behind Render’s proxy) |
| `NODE_VERSION` | `22` (if build fails on `@prisma/engines` postinstall, add this and redeploy) |

Optional (defaults exist in code / seed):

- `ADMIN_USERNAME` / `ADMIN_PASSWORD` — for first admin user when you run seed (see below)

Render injects **`PORT`** automatically — the app already reads `process.env.PORT`.

## 4) Deploy

Click **Create Web Service** and wait until the first deploy finishes **without** “Build failed”.

## 5) Confirm `/health`

Open in a browser (replace with your Render URL):

`https://YOUR-SERVICE.onrender.com/health`

You should see JSON like:

```json
{"status":"ok","timestamp":"…"}
```

If you get **502** or the app never starts, open **Logs** on the service and check for Prisma / `DATABASE_URL` errors.

### Build failed: `@prisma/engines` postinstall

Usually Render is using an old **Node** version. Fix:

1. Web Service → **Environment** → add **`NODE_VERSION`** = `22` → Save.
2. **Manual Deploy** → **Deploy latest commit** (after pulling latest `main` with `.node-version`).
3. Build command should stay: `npm install && npm run build`

## 6) Seed admin user (required — login fails without this)

Migrations create **tables only**, not the `admin` user. Until you seed, `admin` / `admin123` returns **401**.

**Render Shell** (Web Service → **Shell**), from repo root:

```bash
npm run db:seed
```

Or from your PC (with `DATABASE_URL` = Render **External** Postgres URL):

```bash
npm install
npx prisma migrate deploy
npm run db:seed
```

Or temporarily add a **one-off** Render **Shell** command if you prefer (same commands from repo root).

Default login if you use the seed from `.env.example` values: `admin` / `admin123` — **change passwords in production.**

## 7) Point Netlify at this API

On Netlify, set **`VITE_API_URL`** to:

`https://YOUR-SERVICE.onrender.com`  

(no trailing slash), then **Clear cache and deploy** the frontend.

---

## Free tier notes

- The service **spins down** after idle time; the first request can be slow (cold start).
- For serious production, consider a paid instance and managed Postgres backups.

## Railway (short)

Same idea: **New Project** → deploy from GitHub **`AlumPlus-api`** → add **PostgreSQL** plugin → set the same env vars → start command `npm run start:prod` after build `npm install && npm run build`.
