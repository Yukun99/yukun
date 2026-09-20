---
paths:
  - "apps/backend/**"
  - "apps/frontend/src/features/footer/**"
---

# Backend

`apps/backend` is a plain PHP 8.3 + PDO (MySQL) API with no Composer and no framework. It is deployed to `/api/` on the same origin as the site. Its only job today is the footer visitor counter. Setup steps for a new database or machine are in `apps/backend/README.md`.

## Layout

- `index.php` is the single front controller: it requires every class in `src/` by hand, registers the routes and turns an `ApiError` into a `{ "error": ... }` JSON response. A new class must be added to that `require` list, and to the one in `tests/run.php` if it is tested.
- `Http::routePath()` strips the directory of `index.php` from the request path, so the same routes work under Apache at `/api/` and under `php -S` at the root.
- `Db` is a lazy PDO singleton that reads the gitignored `config.php` (`host`, `name`, `user`, `password`, `salt`). Every query goes through `Db::run` with bound parameters; never build SQL from request values.
- `schema.sql` is run by hand in phpMyAdmin because the API's database user only has `SELECT`, `INSERT` and `UPDATE`. A later schema change goes in a new dated file under `migrations/`, also run by hand.

## Visitor Counter

- A visitor is an HMAC-SHA-256 of the client IP address keyed with the `salt` config value. The raw address is never stored or logged. IPv6 addresses are cut to their /64 network first, and IPv4-mapped IPv6 is treated as IPv4.
- Only `REMOTE_ADDR` is trusted. Forwarded headers are client-controlled and would let anyone inflate the count.
- `POST /visitors` registers or refreshes the visitor and returns `{ number, total }`. `GET /visitors` returns the same shape without writing. Bots (matched by user agent) are never stored and get `number: null`.
- `number` is the visitor's position in arrival order, counted with `COUNT(*)` rather than read from `id`, because `AUTO_INCREMENT` leaves gaps.
- `visits` only goes up when the previous request from that visitor is more than 30 minutes old, so reloads do not inflate it.
- The frontend hook `features/footer/use-visitors.ts` sends `GET` when the dev server is proxied to the live site and `POST` otherwise, so local development never adds live visitors.

## Tests

`pnpm nx test backend` runs `tests/run.php`, which loads every `tests/*Test.php` file. Each file calls `$check(label, actual, expected)`. Tests cover the logic that needs no database; `Visitors` is tested against `tests/MemoryVisitorStore.php`, so keep database access behind the `VisitorStore` interface.
