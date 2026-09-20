---
paths:
  - "apps/frontend/src/locales/**"
  - "apps/frontend/src/app/routes.tsx"
  - "apps/frontend/src/pages/**"
  - "apps/frontend/src/features/navigation/**"
---

# i18n and Routes

## Namespaces

- `locales/en.json` / `zh.json` are the default `translation` namespace: shared strings (`common`), `routeNames`, footer. It is also the `fallbackNS`.
- Each page has its own namespace (`home`, `resume`, `catalog`) in `locales/pages/<page>-<lang>.json`.
- Namespaces are registered by hand in `locales/i18n.tsx`; a new JSON file does nothing until it is imported there.
- Every key added to an `en` file needs its `zh` counterpart.

## Rendering Text

- `Section` / `SectionTitle` take `page` + `title` and resolve the heading as `<title>.title` in the `<page>` namespace. Pass `message` instead for a literal string.
- `SectionParagraphByKey` renders a key with placeholders: each placeholder supplies a `{{name}}` value and, for `LINK` / `EMAIL` types, turns the `<name>` tag into a link or mailto link.

## Adding a Route

1. Lazy import and route object in `app/routes.tsx`.
2. `routeNames.<path>` in both `en.json` and `zh.json` — navigation labels come from `getPathLabel` in `common/utils/path-label.ts`.
3. `locales/pages/<page>-en.json` and `-zh.json`, wired into `i18n.tsx`.
