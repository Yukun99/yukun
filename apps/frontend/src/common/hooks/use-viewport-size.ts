import { useScrollViewport } from '@/common/contexts/scroll-context';
import { useEffect, useState } from 'react';

// size of the app scroll container, i.e. how much page fits on screen without scrolling
const useViewportSize = () => {
  const viewport = useScrollViewport();
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!viewport) return;
    const read = () => setSize({ width: viewport.clientWidth, height: viewport.clientHeight });
    read();
    const observer = new ResizeObserver(read);
    observer.observe(viewport);
    return () => observer.disconnect();
  }, [viewport]);

  return { width: size.width || window.innerWidth, height: size.height || window.innerHeight };
};

export default useViewportSize;
