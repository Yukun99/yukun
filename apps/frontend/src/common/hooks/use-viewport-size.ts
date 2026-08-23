import { useScrollViewport } from '@/app/scroll-context';
import { useEffect, useState } from 'react';

// size of the app scroll container, i.e. how much page fits on screen without scrolling
const useViewportSize = () => {
  const getScrollViewport = useScrollViewport();
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    let frame = 0;
    let observer: ResizeObserver | null = null;

    const measure = () => {
      const viewport = getScrollViewport();
      // the scrollbar wrapper mounts deferred, so keep looking until its viewport exists
      if (!viewport) {
        frame = requestAnimationFrame(measure);
        return;
      }
      const read = () => setSize({ width: viewport.clientWidth, height: viewport.clientHeight });
      read();
      observer = new ResizeObserver(read);
      observer.observe(viewport);
    };

    measure();

    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [getScrollViewport]);

  return { width: size.width || window.innerWidth, height: size.height || window.innerHeight };
};

export default useViewportSize;
