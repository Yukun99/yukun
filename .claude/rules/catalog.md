---
paths:
  - "apps/frontend/src/pages/catalog/**"
  - "apps/frontend/src/assets/catalog/**"
---

# Catalog (Weekly Entries)

`pages/catalog/catalog.tsx` is a small content system driven by Markdown. The recurring task in this repo is adding a week.

## Adding a Week

1. `src/assets/catalog/weekN.md`, following `TEMPLATE.md`. Entries are discovered with `import.meta.glob('week*.md')` and the page walks `week` numbers upward, so numbering must be contiguous.
2. A demo component with a default export, normally `pages/catalog/components/weekN.tsx`.

## Entry Format

`parseEntry` gives two `###` headings special meaning (matched case-insensitively); everything else renders as Markdown, with `###` mapped to `SectionTitle`.

- `### Component` — not rendered. The next non-empty line is a key into `import.meta.glob('../../**/*.tsx')`, i.e. a path relative to `catalog.tsx` (`./components/weekN.tsx`). A wrong path fails silently; there is a commented `console.warn` in `loadComponent` for listing valid keys.
- `### Source Code` — each following line is a raw GitHub URL on `main`, fetched at runtime and shown in a syntax highlighter. The source only appears once the file is pushed to `main`.

Entry bodies are English-only Markdown and bypass i18n.
