import { createContext, useCallback, useContext } from 'react';

export const ScrollViewportContext = createContext<HTMLElement | null>(null);

export const useScrollViewport = () => useContext(ScrollViewportContext);

export const useScrollToTop = () => {
  const viewport = useScrollViewport();
  return useCallback(() => viewport?.scrollTo({ top: 0, behavior: 'smooth' }), [viewport]);
};
