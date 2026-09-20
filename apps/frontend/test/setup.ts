// jsdom ships no ResizeObserver, so anything measuring an element throws on mount.
globalThis.ResizeObserver ??= class {
  observe = () => undefined;
  unobserve = () => undefined;
  disconnect = () => undefined;
};
