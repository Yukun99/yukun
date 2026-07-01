import { createContext, useContext } from 'react';

export const ScrollToTopContext = createContext<() => void>(() => undefined);

export const useScrollToTop = () => useContext(ScrollToTopContext);
