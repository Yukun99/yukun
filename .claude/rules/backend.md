---
paths:
  - "apps/backend/**"
  - "apps/frontend/src/features/footer/**"
  - "apps/frontend/src/features/auth/**"
  - "apps/frontend/src/pages/ideas/**"
  - "apps/frontend/src/pages/3d/**"
---

# Backend

`apps/backend` is a plain PHP 8.3 + PDO (MySQL) API with no Composer and no framework. It is deployed to `/api/` on the same origin as the site. It serves the footer visitor counter, the owner-editable ideas grid and the 3D models page. Setup steps for a new database or machine are in `apps/backend/README.md`.

## Layout

- `index.php` is the single front controller: it loads `src/autoload.php`, registers the routes and turns an `ApiError` into a `{ "error": ... }` JSON response. The autoloader maps `Yukun\Api\<Name>` to `src/<Name>.php`, so a new class needs no registration, in `index.php` or in `test/run.php`.
- `Http::routePath()` strips the directory of `index.php` from the request path, so the same routes work under Apache at `/api/` and under `php -S` at the root.
- `Config::get(key)` reads the gitignored `config.php` (`host`, `name`, `user`, `password`, `salt`, `googleClientId`, `editorEmail`) once per request. `Db` is a lazy PDO singleton built from it. Every query goes through `Db::run` with bound parameters; never build SQL from request values.
- `schema.sql` is run by hand in phpMyAdmin because the API's database user only has `SELECT`, `INSERT` and `UPDATE`. A later schema change goes in a new dated file under `migrations/`, also run by hand.

## Visitor Counter

- A visitor is an HMAC-SHA-256 of the client IP address keyed with the `salt` config value. The raw address is never stored or logged. IPv6 addresses are cut to their /64 network first, and IPv4-mapped IPv6 is treated as IPv4.
- Only `REMOTE_ADDR` is trusted. Forwarded headers are client-controlled and would let anyone inflate the count.
- `POST /visitors` registers or refreshes the visitor and returns `{ number, total }`. `GET /visitors` returns the same shape without writing. Bots (matched by user agent) are never stored and get `number: null`.
- `number` is the visitor's position in arrival order, counted with `COUNT(*)` rather than read from `id`, because `AUTO_INCREMENT` leaves gaps.
- `visits` only goes up when the previous request from that visitor is more than 30 minutes old, so reloads do not inflate it.
- The frontend hook `features/footer/use-visitors.ts` sends `GET` when the dev server is proxied to the live site and `POST` otherwise, so local development never adds live visitors.

## Ideas

- `GET /ideas` returns `{ ideas: [{ title, content }, ...] }` for anyone. `PUT /ideas` takes the same body and returns the saved grid, but only for the site owner.
- The grid is a flat list of slots in the `ideas` table, one row per slot. The slot count is always a multiple of `Ideas::COLS` (6) and at least `COLS * MIN_ROWS` (24), and `all()` pads missing slots with blanks. At most `MAX_SLOTS` (396) are accepted.
- The grid never shrinks: a `PUT` with fewer slots than are already stored is a `400`. Clearing a tile just blanks its title and content; the grid was built before the database user had the `DELETE` right.
- Titles are trimmed and limited to 50 characters, and content is kept as is and limited to 5000 characters. Anything else invalid, such as a body that is not `{ ideas: [...] }`, gives a `400` with a specific message.
- `Http::jsonBody()` reads at most 16 MiB and answers `413` beyond that. The body is only read after the token has been verified.
- Writes need `Authorization: Bearer <Google access token>`. `GoogleAuth` sends the token to Google's `tokeninfo?access_token=` endpoint and checks the audience against `googleClientId`, a verified email and the expiry, then compares the email with `editorEmail`. Access tokens have no issuer field, so there is no issuer check. A missing or invalid token is a `401` and any other Google account is a `403`. Both config values must be set, otherwise a request that carries a token fails with a server error; a request without one is still a `401`.
- Apache with CGI or FPM strips the `Authorization` header, so `apps/backend/.htaccess` copies it into the `HTTP_AUTHORIZATION` environment variable and `Http::authorization()` also reads `REDIRECT_HTTP_AUTHORIZATION`.
- The server calls Google over HTTPS with `curl` when it is available and with `file_get_contents` otherwise, so PHP needs the `openssl` extension.
- The frontend hook `pages/ideas/use-ideas.ts` sends the whole grid in a `PUT` 400 ms after the last change, one request at a time, so an older grid can never arrive after a newer one. Edits are only possible once the grid has loaded, so a failed load can never overwrite the stored grid with blanks. A `401` or `403` signs the editor out and reloads the stored grid; any other failure keeps the local edits, and the next change sends them again.

## Models

- `GET /models` returns `{ models: [{ id, name, link, size, createdAt }, ...] }` for anyone, ordered by id and without the file bytes. `GET /models/{id}/file` returns the GLB bytes as `model/gltf-binary`, or a `404` for an unknown or non-numeric id. `POST /models?name=...&link=...` takes the GLB as the raw request body, sent as `application/octet-stream` because mod_security on the host rejects `model/gltf-binary` and other unusual request types with a `406`, and returns the new model's metadata with `201`, but only for the site owner. The token is verified before the body is read.
- Names are trimmed, required and limited to 50 characters. A link is optional, must start with `https://makerworld.com/`, hold no whitespace or control characters and be at most 500 characters. The file is limited to 16 MiB: `Http::rawBody()` answers `413` for a larger body, and `Models` repeats the check with a `400`. Anything invalid gives a `400` with a specific message and writes nothing.
- The file must have a valid GLB header: the ASCII bytes `glTF`, the little-endian version `2`, and a length field equal to the real byte count. Nothing else in the file is inspected.
- `/models/{id}/file` is sent with `Cache-Control: public, max-age=31536000, immutable`, replacing the global `no-store`. This is safe because a model is never changed once stored.
- `DELETE /models/{id}` removes the row and its bytes for the site owner and answers `204`, or `404` for an unknown id. It is the only route that needs the `DELETE` right on the API's database user. There is no route to rename a model.
- Raw-body reads are not subject to PHP's `post_max_size`, which only applies to form and multipart bodies. Apache or mod_security limits on the host may still apply to a large upload, and MySQL's `max_allowed_packet` must be larger than the biggest file, because the whole file is sent in one `INSERT`. Older MySQL versions default to 4 MiB, so check it in phpMyAdmin under Variables.
- A Bambu Studio project with several plates is still one GLB: the browser parser splits the build items by plate using `Metadata/model_settings.config` and exports one glTF scene per plate, which the viewer pages through. Auth is the same as for the ideas grid, and the frontend page is `pages/3d`. The hook `pages/3d/use-models.ts` sends one upload at a time, and a `401` or `403` signs the editor out.

## Tests

`pnpm nx test backend` runs `test/run.php`, which loads every `test/*Test.php` file. Each file calls `$check(label, actual, expected)`. Tests cover the logic that needs no database; `Visitors` is tested against `test/MemoryVisitorStore.php`, so keep database access behind the `VisitorStore` interface. `Ideas` is tested the same way against `test/MemoryIdeaStore.php` and the `IdeaStore` interface, and `Models` against `test/MemoryModelStore.php` and the `ModelStore` interface. `GoogleAuth` is tested with an injected fetch closure that returns canned `tokeninfo` responses, so no test touches the network.
