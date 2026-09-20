---
paths:
  - ".github/workflows/**"
  - "apps/frontend/public/.htaccess"
  - "apps/frontend/vite.config.mts"
  - "apps/backend/.htaccess"
---

# Deploy

Push to `main` triggers `.github/workflows/deploy.yml`: lint, typecheck and test every project, `pnpm build`, bundle the PHP API into `apps/frontend/dist/api/`, then FTPS upload of `apps/frontend/dist/` to Vodien shared hosting. The site and the API share one origin, so there is no CORS setup.

- The "Bundle API into Build" step copies only `index.php`, `.htaccess` and `src/` from `apps/backend`, then generates `api/config.php` from the GitHub secrets `DB_NAME`, `DB_USER`, `DB_PASSWORD` and `VISITOR_SALT`. The schema, tests and example config never reach the server. The FTP secrets are `FTP_SERVER`, `FTP_USERNAME` and `FTP_PASSWORD`.
- Both FTP steps verify the server certificate strictly. The certificate on Vodien shared hosting is issued for the server's own name (for example `sh10003.vodien.com`), not for the site's domain, so the "Resolve FTP Host for Certificate Checks" step runs `.github/scripts/resolve-ftp-host.sh`. The script uses `FTP_SERVER` as is when the certificate already covers it. Otherwise it reads the names on the certificate, keeps only a name that ends in `FTP_CERT_SUFFIX` (`.vodien.com`), and uses it once that name passes a full verification of its own. The suffix is the trust anchor: a name read from an unverified connection is only a hint, so never remove the suffix check or widen it to a public suffix. A server move inside Vodien needs no change; a move to another host needs a new suffix.
- Never change `VISITOR_SALT` after launch: every stored visitor hash depends on it, so a new salt makes all returning visitors count as new.
- The pre-upload cleanup step deletes only `assets/`, `api/`, `index.html`, `favicon.ico` and `.ftp-deploy-sync-state.json` on the server. It must never be widened to the whole directory (see commit `0af7f51`).
- Node and pnpm versions are pinned in the workflow; keep them in step with `packageManager` in the root `package.json`.
- Hosting is shared Apache with PHP, so `apps/frontend/public/.htaccess` provides the SPA fallback for react-router plus cache headers (hashed assets immutable, `index.html` never cached). Client routes work on refresh only because of that rewrite, and the rewrite skips `/api/` so API requests reach PHP.
- `apps/backend/.htaccess` sends every API request to `index.php` and denies direct access to `config.php`.
