# Backend

Plain PHP 8.3 + PDO (MySQL), no Composer. Deployed to `/api/` beside the site and used for the footer visitor counter and the owner-editable ideas grid.

| Method | Path        | Result                                                                           |
| ------ | ----------- | -------------------------------------------------------------------------------- |
| `POST` | `/visitors` | Registers or refreshes the visitor, returns `{ "number": 42, "total": 1337 }`    |
| `GET`  | `/visitors` | Same shape, never writes; `number` is `null` when the visitor is not yet counted |
| `GET`  | `/ideas`    | Returns `{ "ideas": [{ "title": "...", "content": "..." }, ...] }`. The slot count is always a multiple of 6 and at least 24 |
| `PUT`  | `/ideas`    | Takes the same body and returns the saved grid. Needs `Authorization: Bearer <Google access token>` of the configured editor. Answers `401` without a valid token, `403` for any other Google account and `400` for an invalid grid |

Visitors are identified by a salted hash of their IP address. The address itself is never stored.

Only the site owner can change the ideas grid. The browser signs in with Google and sends the resulting access token with each `PUT`; the API checks it with Google and compares the account's email with the configured editor email.

## Production Setup

Do these once, in the Vodien cPanel.

1. **MySQL Databases**: create the database `yukunxuc_yukun`.
2. **MySQL Databases**: create a user for the API with a generated password, add it to the database and grant it only `SELECT`, `INSERT` and `UPDATE`.
3. **phpMyAdmin**: open the SQL tab and run `schema.sql`. Use your cPanel login for this, because the API user cannot create tables.
4. **phpMyAdmin**: run each file in `migrations/` that is newer than your last setup, again with your cPanel login. For the ideas grid that is `migrations/2026-10-10-ideas.sql`. A fresh database already has it through `schema.sql`, and the file is safe to run twice. A grid already stored with a slot count that is not a multiple of 6 still loads, because it is padded, so no data migration is needed.
5. **Google Cloud Console**: create the OAuth client described in "Google Sign-In" below.
6. **GitHub**: in the repository, open Settings, then Secrets and variables, then Actions, and add these repository secrets:

   | Secret             | Value                                                                            |
   | ------------------ | -------------------------------------------------------------------------------- |
   | `DB_NAME`          | `yukunxuc_yukun`                                                                 |
   | `DB_USER`          | The API user from step 2, including the `yukunxuc_` prefix                       |
   | `DB_PASSWORD`      | That user's password                                                             |
   | `VISITOR_SALT`     | A long random string, e.g. the output of `openssl rand -hex 32`. Never change it |
   | `GOOGLE_CLIENT_ID` | The OAuth client ID from "Google Sign-In" below                                  |
   | `EDITOR_EMAIL`     | The Google account email that is allowed to edit the ideas grid                  |

7. Push to `main`. The deploy workflow writes `api/config.php` from those secrets.

Changing `VISITOR_SALT` later makes every returning visitor count as a new one, because the stored hashes no longer match.

## Google Sign-In

The ideas grid is edited after signing in with the Google OAuth popup, which needs an OAuth client ID. Create it once.

1. Open the Google Cloud Console and create a project, or pick an existing one.
2. Go to APIs & Services, then OAuth consent screen. Choose the user type External, enter an app name and a support email, and keep the default scopes. No extra scopes are needed.
3. Go to Credentials, then Create credentials, then OAuth client ID.
4. Set the application type to "Web application".
5. Under Authorized JavaScript origins add both `http://localhost:4205` and `https://yukunxu.com`. The popup sign-in needs no redirect URIs.
6. Create the client and copy the client ID. Only the client ID is needed; never use or store the client secret.

Use that client ID in three places:

- The `GOOGLE_CLIENT_ID` GitHub secret, for production.
- `googleClientId` in `apps/backend/config.php`, for local development.
- `VITE_GOOGLE_CLIENT_ID` in `apps/frontend/.env.local`, which the frontend reads for the sign-in popup.

## Local Setup

Needs PHP 8.3 with `pdo_mysql` enabled and a local MySQL server.

```sh
mysql -u root -e "CREATE DATABASE yukunxuc_yukun"
mysql -u root < apps/backend/schema.sql
mysql -u root < apps/backend/migrations/2026-10-10-ideas.sql   # only needed if the database was created before the ideas grid
cp apps/backend/config.example.php apps/backend/config.php   # then fill in user, password, salt, googleClientId and editorEmail
cp apps/frontend/.env.example apps/frontend/.env.local       # points the dev proxy at the local API
pnpm dev
```

Verifying Google tokens locally needs the `openssl` extension enabled in `php.ini`, and optionally `curl`, because the API calls Google over HTTPS. Without it every write to the ideas grid fails with `401`.

Without `apps/frontend/.env.local` the dev server proxies `/api` to the live site and only reads the count, so local development never adds live visitors.

## Checks

```sh
pnpm nx lint backend   # php -l over every PHP file
pnpm nx test backend   # php test/run.php
```
