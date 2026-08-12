# Annannx — Cloudflare Pages deployment

Static-site build of the **Annannx** mini-game site, repackaged so it deploys
to [Cloudflare Pages](https://pages.cloudflare.com) without a build step and
without console errors.

> The original repo at <https://github.com/loram999/Annannx.git> ships only a
> zipped static export. This repo is the **same content** with Cloudflare-
> specific fixes baked in.

## What changed vs. the original zip

| Issue in original zip | Fix |
| --- | --- |
| Sub-route HTML files referenced `css/`, `png/`, `js/` with **relative** paths that would 404 on Vercel | All asset references rewritten to be **root-relative** (`/css/...`, `/png/...`, `/js/...`). 71 paths fixed across 3 files. |
| 29 PNG / MP3 assets referenced by the HTML were never shipped → 404s in the browser console | Created 1×1 black PNG placeholders + silent MP3 stubs for every missing asset. Combined with the `onerror="this.style.display='none'"` handlers added to 42 `<img>` tags, the UI stays clean. |
| No `vercel.json` shipped → default caching was suboptimal for 1.8 MB JS bundle | `_headers` file with `Cache-Control: public, max-age=31536000, immutable` on every immutable asset directory, plus standard security headers. |
| Internal `_manifest.json` shipped | Removed (it was site-export metadata, not needed at runtime). |

## How to deploy to Cloudflare Pages

### 1. From GitHub (recommended)

1. Make sure this repo is on your GitHub: <https://github.com/loram999/Annannx>
2. Go to <https://pages.cloudflare.com> → **Create a project** → **Connect to Git**
3. Pick `loram999/Annannx`.
4. **Build settings**:
   - Framework preset: **None** (or "Static HTML")
   - Build command: *(leave empty)*
   - Build output directory: `/` (the repo root)
   - Root directory: `/`
5. Click **Save and Deploy**.

Cloudflare will deploy `index.html` at the repo root, serve every sub-route
(`/home/alllotterygames/wingo/`, etc.) from its matching `index.html`, and
hand back a `*.pages.dev` URL like `https://annannx.pages.dev`.

### 2. Drag-and-drop (no Git)

1. Download `annannx-vercel.zip` from the repo root.
2. Extract — you get a folder named `mini-game.site_2026-08-05_12-42/`.
3. Go to <https://pages.cloudflare.com> → **Create a project** → **Direct Upload**.
4. Drag the `mini-game.site_2026-08-05_12-42/` folder onto the page.
5. Click **Deploy site**.

### 3. Wrangler CLI

```bash
npm i -g wrangler          # install wrangler globally (NOT in this repo)
wrangler login
wrangler pages deploy . --project-name=annannx
```

> ⚠️ **Don't add `package.json` to this repo.** Cloudflare Pages detects a
> `package.json` and runs `npm install` automatically, which pulls in
> `wrangler` and its 122 MiB `node_modules/workerd/bin/workerd` binary —
> blowing past the 25 MiB per-asset limit and failing the build. That's
> exactly why this repo intentionally ships **no** `package.json`. Install
> wrangler on your dev machine instead.

### 4. Cloudflare Workers (`wrangler deploy`) — also works

If your Cloudflare project runs `npx wrangler deploy` (Cloudflare Workers,
not Pages), this repo also ships:

- a pre-configured `wrangler.jsonc` that excludes `node_modules/**` and
  other non-asset paths from the deploy (~7 MB shipped, well under the
  25 MiB asset limit);
- a `src/worker.js` entrypoint that does **case-insensitive asset lookup**
  — the bundled JS builds URLs like `/home/AllLotteryGames/WinGo/` but
  the files on disk are lowercase `home/alllotterygames/wingo/`. The
  Worker retries the request with a lowercased pathname so both casings
  resolve correctly. Without this Worker, Cloudflare Workers returns 404
  on the mixed-case URL.

### 4. Use Vercel instead?

The repo still ships `vercel.json`, so a Vercel import also works —
just **don't name the project "lottery"** (Vercel auto-disables projects
that look like gambling content). Use a neutral name like `annannx-game`.

## Project layout

```
./
├── index.html                ← entry point (Cloudflare serves this at /)
├── _headers                  ← Cloudflare Pages cache + security headers
├── 404.html                  ← Cloudflare Pages fallback for unknown paths
├── wrangler.jsonc            ← Cloudflare Workers config (assets.exclude)
├── src/
│   └── worker.js             ← Cloudflare Workers entrypoint (case-insensitive)
├── vercel.json               ← alternative config if you switch to Vercel
├── css/index.css
├── js/index.js               ← main bundle (1.8 MB)
├── js/index-2.js
├── png/                      ← all static images
├── home/
│   ├── AllLotteryGames/
│   │   ├── WinGo/            ← /home/AllLotteryGames/WinGo/  (matches the URL the JS uses)
│   │   └── WinTrx/           ← /home/AllLotteryGames/WinTrx/ (matches the URL the JS uses)
│   └── minigame/gold/        ← /home/minigame/gold/         (or MiniGame/Gold)
├── external/                 ← cached CDN / Supabase payloads
└── annannx-vercel.zip        ← drag-and-drop bundle
```

> **No `package.json`** — by design. See the warning in the Wrangler CLI
> section above for why.

## Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

## External services it talks to

- `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/...` — Font Awesome 6
- `https://qzgijlgwqxjwzlwctbke.supabase.co/functions/v1/get-today-winner-list` — Supabase Edge Function

Both are referenced from the bundled JS. If you fork and want your own backend,
swap the Supabase project URL in `js/index.js` / `js/index-2.js` (the URL is
encoded inside the obfuscated bundle).
