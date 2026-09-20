---
paths:
  - "apps/frontend/src/**"
---

# Frontend Layout, Scrolling and Mobile

## Scrolling

The window does not scroll. `App` is a fixed `100vh` flex column and all page content lives inside an `OverlayScrollbarsComponent`. Anything that needs scroll position or scroll control (scroll-to-top, scroll-snap, timeline progress, in-view reveals) must get the viewport element via `useScrollViewport()` / `useScrollToTop()` from `common/contexts/scroll-context.ts` rather than using `window`.

## Mobile

- `useIsMobile` is a `(hover: none) and (pointer: coarse)` media query, not a width breakpoint, so touchscreen laptops count as desktop.
- Mobile devices in portrait get `RotateGate` instead of the app (`useNeedsRotate`), so mobile layouts are designed for landscape only.
- Margins and padding come from `useSpacing()` in `common/hooks/use-spacing.ts`, which switches on `useIsMobile`. Use it instead of hard-coded spacing.

## Pages and Sections

Pages wrap content in `Page` and compose `Section` (the frosted-glass card in `common/components/sections/section.tsx`) plus the `section-*` helpers. Layout variants are boolean props (`centered`, `blurless`, `clear`, `snug`, `tight`); entrance animation is `reveal='mount' | 'scroll'` via `useReveal`, or the `Reveal` wrapper for non-section content.

Colours come from the tokens in `common/utils/palette.ts` (`GRAY`, `OPACITY`, `PURPLE`, `getColor`, `getPageElementBgColor`) or the MUI theme, not ad-hoc hex values.

## Theme

MUI `colorSchemes` light/dark with `colorSchemeSelector: 'class'`; read the mode with `useResolvedMode()` from `common/hooks/use-resolved-mode.ts`, which returns `'light'` or `'dark'`. `useColorScheme().mode` is `'system'` until the reader picks a mode, so only use it for `setMode`. `apps/frontend/test/app/app.spec.tsx` rebuilds the same theme, so keep it in step with `main.tsx`.
