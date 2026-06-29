import { createContext, useContext } from 'react';

export const ScrollToTopContext = createContext<() => void>(() => {});

export const useScrollToTop = () => useContext(ScrollToTopContext);
