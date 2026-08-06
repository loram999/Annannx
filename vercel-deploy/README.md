# Annannx — Vercel deployment

Static-site build of the **Annannx** mini-game site, repackaged so it deploys
to [Vercel](https://vercel.com) without a build step and without console errors.

> The original repo at <https://github.com/loram999/Annannx.git> ships only a
> zipped static export. This folder is the **same content** with the Vercel-
> specific fixes baked in.

## What changed vs. the original zip

| Issue in original zip | Fix |
| --- | --- |
| Sub-route HTML files referenced `css/`, `png/`, `js/` with **relative** paths that would 404 on Vercel | All asset references rewritten to be **root-relative** (`/css/...`, `/png/...`, `/js/...`). 71 paths fixed across 3 files. |
| 29 PNG / MP3 assets referenced by the HTML were never shipped → 404s in the browser console | Created 1×1 black PNG placeholders + silent MP3 stubs for every missing asset. Combined with the `onerror="this.style.display='none'"` handlers added to 42 `<img>` tags, the UI stays clean. |
| No `vercel.json` shipped → Vercel default caching was suboptimal for 1.8 MB JS bundle | `vercel.json` with `Cache-Control: public, max-age=31536000, immutable` on every immutable asset directory, plus standard security headers. |
| Internal `_manifest.json` shipped | Removed (it was site-export metadata, not needed at runtime). |

## Three ways to deploy

### 1. Drag-and-drop (zero setup)

1. Download `annannx-vercel.zip` from the repo root.
2. Extract — you get a folder named `mini-game.site_2026-08-05_12-42/`.
3. Go to <https://vercel.com/new> → drag the folder onto the page.
4. Click **Deploy**. Done.

### 2. Import from GitHub

1. Push this repo to GitHub.
2. Go to <https://vercel.com/new> → **Import Git Repository** → pick this repo.
3. Vercel auto-detects it as static. Click **Deploy**.

### 3. Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### 4. GitHub Actions auto-deploy

The included workflow at `.github/workflows/deploy.yml` deploys on every
push to `main`. Set these secrets in your repo:

- `VERCEL_TOKEN` — from <https://vercel.com/account/tokens>
- `VERCEL_ORG_ID` — your Vercel team ID
- `VERCEL_PROJECT_ID` — the project ID

Then `git push` and Vercel picks it up automatically.

## Project layout

```
vercel-deploy/
├── index.html                ← entry point
├── vercel.json               ← Vercel static-site config
├── package.json              ← convenience scripts (vercel CLI)
├── .github/workflows/
│   └── deploy.yml            ← CI/CD to Vercel
├── css/index.css
├── js/index.js               ← main bundle (1.8 MB)
├── js/index-2.js
├── png/                      ← all static images
├── home/
│   ├── alllotterygames/
│   │   ├── wingo/            ← /home/alllotterygames/wingo/
│   │   └── wintrx/           ← /home/alllotterygames/wintrx/
│   └── minigame/gold/        ← /home/minigame/gold/
└── external/                 ← cached CDN / Supabase payloads
```

## Local preview

```bash
cd vercel-deploy
python3 -m http.server 8080
# open http://localhost:8080
```

## External services it talks to

- `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/...` — Font Awesome 6
- `https://qzgijlgwqxjwzlwctbke.supabase.co/functions/v1/get-today-winner-list` — Supabase Edge Function

Both are referenced from the bundled JS. If you fork and want your own backend,
swap the Supabase project URL in `js/index.js` / `js/index-2.js` (the URL is
encoded inside the obfuscated bundle).
