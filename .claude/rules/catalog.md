---
paths:
  - "apps/frontend/src/pages/catalog/**"
  - "apps/frontend/src/assets/catalog/**"
---

# Catalog (Weekly Entries)

`pages/catalog/catalog.tsx` is a small content system driven by Markdown. The recurring task in this repo is adding a week.

## Adding a Week

1. `src/assets/catalog/weekN.md`, following `TEMPLATE.md`. Entries are discovered with `import.meta.glob('week*.md')` and the page walks `week` numbers upward, so numbering must be contiguous. The forward button stops one step past the last entry, where the coming soon card shows.
2. A demo component with a default export at `pages/catalog/components/weekN.tsx`.

## Entry Format

`parseEntry` gives two `###` headings special meaning (matched case-insensitively); everything else renders as Markdown, with `###` mapped to `SectionTitle`.

- `### Component` — not rendered. The next non-empty line is a key into `import.meta.glob('./components/week*.tsx')`, i.e. a path relative to `catalog.tsx` (`./components/weekN.tsx`). Demo components outside that folder are not picked up. A wrong path fails silently; there is a commented `console.warn` in `loadComponent` for listing valid keys.
- `### Source Code` — each following line is a file path relative to `src/` (for example `common/hooks/use-reveal.ts`). The text is bundled at build time through a lazy `?raw` glob over `/src/**/*.{ts,tsx}` and shown in a syntax highlighter, in the order listed. A wrong path is skipped silently.

Entry bodies are English-only Markdown and bypass i18n. The page's own text (`week`, `comingSoon`) lives in the `catalog` namespace.
