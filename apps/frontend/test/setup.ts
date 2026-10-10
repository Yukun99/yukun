// jsdom ships no ResizeObserver, so anything measuring an element throws on mount.
globalThis.ResizeObserver ??= class {
  observe = () => undefined;
  unobserve = () => undefined;
  disconnect = () => undefined;
};

// jsdom ships no IntersectionObserver, so in-view gates would never open; report every element as visible.
globalThis.IntersectionObserver ??= class {
  constructor(private callback: IntersectionObserverCallback) {}
  observe = () => this.callback([{ isIntersecting: true } as IntersectionObserverEntry], this as never);
  unobserve = () => undefined;
  disconnect = () => undefined;
} as never;
