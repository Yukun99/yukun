import { createContext, useContext } from 'react';

export const ScrollToTopContext = createContext<() => void>(() => undefined);

export const useScrollToTop = () => useContext(ScrollToTopContext);

export const ScrollViewportContext = createContext<() => HTMLElement | null>(() => null);

export const useScrollViewport = () => useContext(ScrollViewportContext);
