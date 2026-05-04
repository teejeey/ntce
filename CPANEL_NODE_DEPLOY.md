# Deploy NTCE on cPanel (Node.js App)

This app uses **Next.js route handlers** (`/api/*`) as a proxy to Google Apps Script. You must run **`next build` + a Node server**, not a static HTML export.

**Requirements:** Node.js **20.x** (see `.nvmrc` and `package.json` `engines`). Match this in cPanel’s Node.js selector.

---

## 1. Production environment before build

Values used at **`npm run build`** are baked into the client and into the standalone server config (`NEXT_PUBLIC_*` and `next.config.mjs` `env`).

1. On your machine (or CI), create **`.env.production`** in the project root (do not commit secrets you care about if the repo is public), for example:
   - `GAS_WEB_APP_URL` — your Apps Script web app URL (server-side API routes).
   - `NEXT_PUBLIC_GAS_WEB_APP_URL` — same URL if the browser must know it; align with `next.config.mjs`.

2. Run a clean production build:

```bash
npm ci
npm run build
```

Fix any build errors before uploading.

---

## 2. Recommended: standalone bundle (smaller upload)

`next.config.mjs` sets `output: "standalone"`. After `npm run build`, assemble one folder to upload as the application root.

From the project root:

**Windows (PowerShell)**

```powershell
# Copy traced server into a deploy folder (example name)
New-Item -ItemType Directory -Force deploy | Out-Null
Copy-Item -Recurse .next\standalone\* deploy\
New-Item -ItemType Directory -Force deploy\.next\static | Out-Null
Copy-Item -Recurse .next\static\* deploy\.next\static\
if (Test-Path public) { Copy-Item -Recurse public deploy\public }
```

**Linux / macOS / cPanel SSH**

```bash
mkdir -p deploy && cp -r .next/standalone/. deploy/
mkdir -p deploy/.next/static && cp -r .next/static/. deploy/.next/static/
test -d public && cp -r public deploy/public || true
```

Zip **`deploy/`** (contents should include `server.js` at the top level) and upload to the server, e.g. `~/nodeapps/ntce/`.

**Important:** If you change `GAS_WEB_APP_URL` / `NEXT_PUBLIC_*`, run **`npm run build` again** and re-copy `deploy` as above.

---

## 3. cPanel: Create the Node.js application

Steps vary slightly by host; look for **“Setup Node.js App”** or **“Application Manager”**.

1. **Node.js version:** **20.x** (LTS).
2. **Application root:** The directory that contains **`server.js`** (the assembled `deploy` folder from step 2).
3. **Application URL:** Your domain or subdomain (cPanel often sets **PORT** and a reverse proxy automatically).
4. **Application startup file:** `server.js` (the file Next generated under `standalone`).

The standalone `server.js` reads **`PORT`** and **`HOSTNAME`** (defaults to `0.0.0.0`). Do not hard-code port **3000** in cPanel if the panel assigns a different **PORT** — use the environment the UI provides.

5. **Environment variables** (cPanel “Environment variables” for the app), minimum:

| Variable | Purpose |
|----------|---------|
| `NODE_ENV` | `production` |
| `GAS_WEB_APP_URL` | Apps Script web app URL (server API routes) |

If your build relied on `.env.production` for `NEXT_PUBLIC_GAS_WEB_APP_URL`, that value is already in the built assets; you can still set `NEXT_PUBLIC_GAS_WEB_APP_URL` on the server for consistency, but **changing it without a rebuild** may not update everything the client already inlined.

6. **Start / Restart** the application from cPanel.

---

## 4. Alternative: full git deploy + build on the server

If you prefer to build on the host (SSH terminal in cPanel):

```bash
cd /path/to/app
npm ci
npm run build
# Then either run from .next/standalone (after the copy steps above) or use `npm start` from project root
```

For **`npm start`** (`next start`), set application root to the **repository root** (where `package.json` is) and startup to **`npm`** with arguments **`start`** *only if* your cPanel UI supports that pattern. Otherwise use the **standalone** layout with **`server.js`**.

---

## 5. Smoke test after deploy

- Open the site over **HTTPS** (cookies / mixed content issues if HTTP proxy is wrong).
- Hit `/api/schedule` or `/api/events` — should return JSON, not 404.
- Registration **check-email** and form submit depend on **GAS** and correct **`GAS_WEB_APP_URL`** on the server.

---

## 6. Troubleshooting

| Issue | What to check |
|-------|----------------|
| 502 / Application failed | Logs in cPanel Node app; wrong **application root** or missing `deploy/.next/static`. |
| API always fails | `GAS_WEB_APP_URL` in cPanel env; Apps Script deployed as **Execute as: Me**, **Who has access: Anyone**. |
| Old content after env change | Re-run **`npm run build`** with new env and redeploy the bundle. |
| Port errors | Let cPanel set **PORT**; do not conflict with another app. |

---

## Local dry run (same as production server)

After assembling `deploy/`:

```bash
cd deploy
set PORT=3000
node server.js
```

On Windows PowerShell: `$env:PORT=3000; node server.js`

Open `http://localhost:3000` and verify `/api/*` routes.
