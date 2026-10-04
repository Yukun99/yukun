---
paths:
  - "apps/frontend/src/**"
---

# Frontend Layout, Scrolling and Mobile

## Scrolling

The window does not scroll. `App` is a fixed `100vh` flex column and all page content lives inside a `Scroller` (`common/components/scroller.tsx`), the only wrapper around OverlayScrollbars. Every scroll container in the app is a `Scroller`, never a plain `overflow: auto` box, so all scrollbars look the same: always visible, rounded, native grey. `axis` limits scrolling to one direction, `thickness` and `inset` place the handle, `onViewport` hands out the element that actually scrolls and `viewportStyle` lays out the children. Anything that needs scroll position or scroll control (scroll-to-top, scroll-snap, timeline progress, in-view reveals) must get the viewport element via `useScrollViewport()` / `useScrollToTop()` from `common/contexts/scroll-context.ts` rather than using `window`. The context holds the viewport element itself, set by `App` through the `Scroller` `onViewport` callback, so it is `null` on the first render and hooks should depend on it instead of polling for it.

Hooks that act once scrolling has stopped (`useScrollSnap`, `useSnapToLargest`) are strategies on top of `useSettledScroll(container, onSettle, delay)` in `common/hooks/use-settled-scroll.ts`, which owns the scroll listener, the settle debounce, the pointer hold and the reduced motion check. Pass a stable `onSettle` (module-level function or `useCallback`), since a new identity resubscribes and clears a pending settle. A container of `null` means "not mounted yet" and does nothing.

## Mobile

- `useIsMobile` is a `(hover: none) and (pointer: coarse)` media query, not a width breakpoint, so touchscreen laptops count as desktop.
- Mobile devices in portrait get `RotateGate` instead of the app (`useNeedsRotate`), so mobile layouts are designed for landscape only.
- Margins and padding come from `useSpacing()` in `common/hooks/use-spacing.ts`, which switches on `useIsMobile`. Use it instead of hard-coded spacing.

## Pages and Sections

Pages wrap content in `Page` and compose `Section` (the frosted-glass card in `common/components/sections/section.tsx`) plus the `section-*` helpers. The surface is picked with `variant`: `frosted` (default, blurred glass), `flat` (same background, no blur, for sections nested inside another section) or `clear` (no background at all). Layout flags are `centered`, `noMargin` and `noPadding`, and extra styles go through `sx`. Every section wraps its content in a `Scroller`, so a section that is kept from growing (a fixed height, or `flex: 1` with `minHeight: 0` in a constrained parent) scrolls on its own, with the handle sitting in the section padding clear of the rounded corners; a section that can grow never shows a scrollbar; entrance animation is `reveal='mount' | 'scroll'` via `useReveal`, or the `Reveal` wrapper for non-section content.

Colours come from the tokens in `common/utils/palette.ts` (`GRAY`, `OPACITY`, `PURPLE`, `getColor`, `getPageElementBgColor`) or the MUI theme, not ad-hoc hex values.

## Theme

MUI `colorSchemes` light/dark with `colorSchemeSelector: 'class'`; read the mode with `useResolvedMode()` from `common/hooks/use-resolved-mode.ts`, which returns `'light'` or `'dark'`. `useColorScheme().mode` is `'system'` until the reader picks a mode, so only use it for `setMode`. The theme is created once in `app/theme.ts` and shared by `main.tsx` and the app spec. Layering uses `theme.zIndex` (`appBar` for the desktop bar, `drawer + 1` for the menu buttons, `modal + 1` for the rotate gate) rather than literal numbers.
