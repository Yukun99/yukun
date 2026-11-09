import { useScrollViewport } from '@/common/contexts/scroll-context';
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const useScrollReset = () => {
  const { pathname } = useLocation();
  const viewport = useScrollViewport();
  const last = useRef(pathname);

  useEffect(() => {
    if (!viewport || pathname === last.current) return;
    last.current = pathname;
    viewport.scrollTop = 0;
  }, [pathname, viewport]);
};

export default useScrollReset;
