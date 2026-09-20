# Backend

Plain PHP 8.3 + PDO (MySQL), no Composer. Deployed to `/api/` beside the site and used for the footer visitor counter.

| Method | Path        | Result                                                                           |
| ------ | ----------- | -------------------------------------------------------------------------------- |
| `POST` | `/visitors` | Registers or refreshes the visitor, returns `{ "number": 42, "total": 1337 }`    |
| `GET`  | `/visitors` | Same shape, never writes; `number` is `null` when the visitor is not yet counted |

Visitors are identified by a salted hash of their IP address. The address itself is never stored.

## Production Setup

Do these once, in the Vodien cPanel.

1. **MySQL Databases**: create the database `yukunxuc_yukun`.
2. **MySQL Databases**: create a user for the API with a generated password, add it to the database and grant it only `SELECT`, `INSERT` and `UPDATE`.
3. **phpMyAdmin**: open the SQL tab and run `schema.sql`. Use your cPanel login for this, because the API user cannot create tables.
4. **GitHub**: in the repository, open Settings, then Secrets and variables, then Actions, and add these repository secrets:

   | Secret         | Value                                                                            |
   | -------------- | -------------------------------------------------------------------------------- |
   | `DB_NAME`      | `yukunxuc_yukun`                                                                 |
   | `DB_USER`      | The API user from step 2, including the `yukunxuc_` prefix                       |
   | `DB_PASSWORD`  | That user's password                                                             |
   | `VISITOR_SALT` | A long random string, e.g. the output of `openssl rand -hex 32`. Never change it |

5. Push to `main`. The deploy workflow writes `api/config.php` from those secrets.

Changing `VISITOR_SALT` later makes every returning visitor count as a new one, because the stored hashes no longer match.

## Local Setup

Needs PHP 8.3 with `pdo_mysql` enabled and a local MySQL server.

```sh
mysql -u root -e "CREATE DATABASE yukunxuc_yukun"
mysql -u root < apps/backend/schema.sql
cp apps/backend/config.example.php apps/backend/config.php   # then fill in user, password and salt
cp apps/frontend/.env.example apps/frontend/.env.local       # points the dev proxy at the local API
pnpm dev
```

Without `apps/frontend/.env.local` the dev server proxies `/api` to the live site and only reads the count, so local development never adds live visitors.

## Checks

```sh
pnpm nx lint backend   # php -l over every PHP file
pnpm nx test backend   # php tests/run.php
```
