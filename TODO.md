# Pending Work

Follow-ups from the structure audit of September 2026. Everything else from that audit is done. Remove an item from
this file once it lands.

## Tests and Continuous Integration

- Move pure logic out of components and hooks so that it can be unit tested: `parseEntry` in
  `pages/catalog/catalog.tsx`, `getColor` in `common/utils/palette.ts`, `parse` in `features/footer/use-visitors.ts`,
  the interpolation in `use-timeline-progress.ts` and `collide` in `use-floating-circles.ts`.
- Add a test that compares the key sets of every `en` and `zh` locale file, to enforce the rule that they stay in sync.
- Add a `ci.yml` workflow that runs lint, typecheck and test on pull requests. Today these checks only run inside
  `deploy.yml`, on a push to `main`, right before deploying.
- Replace the hand-written "Bundle API into Build" step in `deploy.yml` with an Nx `backend:bundle` target and a script
  file for writing `config.php`, so that the bundle can be built and checked locally.

## Smaller Notes

- `use-floating-circles.ts` has one `no-loop-func` lint warning in `spawnBodies`.
