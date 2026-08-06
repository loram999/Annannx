# Annannx

Static mini-game / lottery site (Myanmar-locale).

## Contents

- `mini-game.site_2026-08-05_12-42.zip` — original raw export from the site-scraper tool.
- `annannx-vercel.zip` — **Vercel-ready** repackaging of the same site. Drop this on Vercel and it deploys as a static site with no build step and no console errors. See `vercel-deploy/README.md` for what changed.
- `vercel-deploy/` — same content as the zip but unzipped, so you can push to GitHub and either import to Vercel or set up GitHub Actions auto-deploy.

## Quickest deploy

1. Download [`annannx-vercel.zip`](../../raw/main/annannx-vercel.zip).
2. Extract → you get `mini-game.site_2026-08-05_12-42/`.
3. Drag that folder onto <https://vercel.com/new>.
4. Click **Deploy**.

That's it — no `npm install`, no build command, no environment variables.

## Or import from this repo

Point Vercel at this repo and it'll detect `vercel-deploy/` as a static project — even cleaner, with auto-deploy on every push.
