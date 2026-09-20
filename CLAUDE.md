# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Personal portfolio site (yukunxu.com). Nx 23 monorepo on pnpm 11.8 / Node 24. `apps/frontend` is the site and
`apps/backend` is a small PHP API (visitor counter) deployed beside it under `/api/`; `packages/` is empty.

Frontend stack: React 19, MUI 9 (Emotion), react-router 7, i18next, Vite 8. Backend stack: plain PHP 8.3 + PDO (MySQL),
no Composer.

## Commands

Run from the repo root. Frontend targets are inferred by Nx plugins (`nx.json`); backend targets are declared in
`apps/backend/project.json`.

```sh
pnpm install
pnpm dev                      # frontend (localhost:4205) + PHP backend (localhost:3333)
pnpm build                    # nx build frontend -> apps/frontend/dist
pnpm nx serve frontend        # frontend only

pnpm nx lint frontend
pnpm nx typecheck frontend
pnpm nx test frontend         # vitest (jsdom, globals on)
pnpm nx test frontend -- test/app/app.spec.tsx   # single file
pnpm nx test frontend -- -t "should render"     # single test by name
pnpm nx lint backend          # php -l over every PHP file
pnpm nx test backend          # php test/run.php
```

Frontend tests are vitest. The root `vitest.config.mts` lists the app configs as projects, so running vitest from the
repo root (as the IDE does) resolves the `@/` alias too. Backend tests are plain PHP files run by
`apps/backend/test/run.php`; see `backend.md`.

## Working Here

- Start every session in caveman ultra mode (`caveman` skill, `ultra` level) without being asked.
- Before starting any large task, get a fresh context: ask the user to run `/clear` (Claude can't run it itself) and
  restate the task, unless the session is already fresh.
- Large or complex tasks: plan first. Raise every doubt as a question instead of assuming, and only start executing once
  the doubts are answered and the plan is confirmed.
- After finishing a large or complex task, test it in the browser on both desktop and mobile. Assume the dev server is
  already running at `localhost:4205`; only ask the user if it needs a restart.
- When verifying a large or complex task, always run the test, lint and typecheck commands in the background so they
  don't block other work such as browser testing. Collect their results once they finish and report them before calling
  the task done.
- Mobile testing: Claude can't switch the browser into device emulation itself. Ask the user to open DevTools on the tab
  and set it to a mobile device in landscape, then continue once they confirm.
- Documentation files (`CLAUDE.md`, `.claude/rules/`, READMEs) are read by developers as well as Claude, so keep every
  change human readable: full sentences, no shorthand only Claude would follow. Headings use title case, e.g. "Like This
  in Terms of Capitalisation".
- Don't run prettier. The IDE formats on file write.
- Naming: prefer the shortest name that still explains the thing clearly.

## Structure

`apps/frontend/src/`, imported through the `@/*` alias:

- `app/` — shell: app, routes, palette tokens, scroll context
- `pages/<page>/` — one lazy-loaded route each, with page-local `components/`, `sections/`, `utils/`
- `features/` — cross-page chrome (navigation, footer, rotate gate)
- `common/` — reusable components, hooks, skeletons, utils
- `locales/` — en/zh translations
- `assets/catalog/` — Markdown entries for the catalog page

Put code at the narrowest level that fits: page-local first, `common/` only once it is shared.

## Conventions

- Styling is the MUI `sx` prop; there are no CSS files.
- All user-facing text goes through i18next, with en and zh kept in sync.
- Files are kebab-case. Components are arrow functions with `export default`; hooks are `use-*.ts` with a default
  export; props are a `type <Name>Props`.
- Use `@/` imports rather than relative ones, and deep MUI imports (`@mui/material/Box`), not the barrel.
- The `@/` alias is declared twice and both must stay in step: `paths` in the frontend tsconfig files for TypeScript,
  and `resolve.alias` in `vite.config.mts` for Vite and vitest. It is an explicit alias because resolving it from
  tsconfig failed on Linux CI for files outside `src/`.
- Prettier style: single quotes (JSX too), 100 columns, operators at line start. `prettier-plugin-organize-imports`
  reorders imports on format — don't hand-order them.
- Tests live in a `test/` folder beside `src/` in each app, never next to the code. In the frontend a spec keeps the
  same path relative to `test/` as the file it tests has relative to `src/`, e.g.
  `src/features/footer/footer-view-counter.tsx` is tested by `test/features/footer/footer-view-counter.spec.tsx`.
- TS is strict with `noUnusedLocals` and `noImplicitReturns`.
- Avoid code comments. Only where a weird interaction or complicated logic really needs one, keep it to 1 line (2 at
  most).
- Dependency versions are pinned exactly (no `^`).
- Licence is AGPL-3.0-only.

## Topic Rules

Area-specific instructions live in `.claude/rules/` and load automatically when matching files are touched (`paths`
frontmatter); task-triggered rules have no `paths` and are always loaded. Add new specifics there, not here.

- `frontend-layout.md` — scroll container, mobile/landscape model, `Section` system, theme
- `i18n-and-routes.md` — namespaces, text helpers, adding a route
- `catalog.md` — weekly entry format and how to add a week
- `backend.md` — PHP API layout, database config, local setup, tests
- `deploy.md` — GitHub Actions FTPS deploy, secrets and `.htaccess`
- `security-audit.md` — procedure when asked for a security audit (always loaded)