---
paths:
  - ".github/workflows/**"
  - "apps/frontend/public/.htaccess"
  - "apps/frontend/vite.config.mts"
---

# Deploy

Push to `main` triggers `.github/workflows/deploy.yml`: `pnpm build`, then FTPS upload of `apps/frontend/dist/` to Vodien shared hosting. Only the frontend is deployed; the backend is not hosted anywhere.

- The pre-upload cleanup step deletes only `assets/`, `index.html`, `favicon.ico` and `.ftp-deploy-sync-state.json` on the server. It must never be widened to the whole directory (see commit `0af7f51`).
- Node and pnpm versions are pinned in the workflow; keep them in step with `packageManager` in the root `package.json`.
- Hosting is static Apache, so `apps/frontend/public/.htaccess` provides the SPA fallback for react-router plus cache headers (hashed assets immutable, `index.html` never cached). Client routes work on refresh only because of that rewrite.
