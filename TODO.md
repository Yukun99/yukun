# Pending Work

Follow-ups from the structure audit of September 2026. Everything else from that audit is done. Remove an item from
this file once it lands.

## Scroll Context and Snap Hooks

`use-scroll-snap`, `use-snap-to-largest` and `use-viewport-size` each poll with `requestAnimationFrame` until the scroll
viewport exists, because `common/contexts/scroll-context.ts` only hands out a getter. The two snap hooks also repeat the
same plumbing: the scroll listener, the settle timer, the pointer hold and the reduced motion check.

1. Hold the viewport element in state in `App` (OverlayScrollbars reports it through its `initialized` event) and put
   the element itself in the context, so hooks re-run when it appears and the polling goes away.
2. Extract a shared `useSettledScroll(container, onSettle, delay)` that owns the listener, the debounce, the pointer
   hold and the cleanup.
3. Reduce `useScrollSnap` ("land on the nearest marked element within reach") and `useSnapToLargest` ("frame the pane
   that covers most of the screen") to small strategies on top of it.

The hooks stay in `common/` because other pages are expected to reuse them. This changes touch gesture timing, so it
needs its own round of testing on desktop and on a mobile device in landscape.

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

- `Section` takes many boolean layout flags (`centered`, `blurless`, `clear`, `snug`, `tight`), and its `style` prop is
  really an `sx` object. A `variant` prop and a rename would make call sites easier to read.
- `pages/home/home.tsx` and `pages/resume/sections/contact-section.tsx` repeat a `SectionParagraphByKey` block per
  detail line. A small array of `{ key, type }` entries mapped to the component would remove the repetition.
- `SectionAccordion` needs three props (`accordionNumber`, `expandedAccordion`, `setExpandedAccordion`) on every use.
  A small accordion group component could own that state.
- `use-floating-circles.ts` has one `no-loop-func` lint warning in `spawnBodies`.
