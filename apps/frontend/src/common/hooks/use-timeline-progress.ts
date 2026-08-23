import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

export type TimelineAxis = 'x' | 'y';

/**
 * tracks how far the timeline has scrolled, as a fractional index into its items
 * anchorRef: element whose centre counts as the "now" line of the dial
 */
const useTimelineProgress = (
  count: number,
  anchorRef: RefObject<HTMLElement | null>,
  axis: TimelineAxis = 'y',
) => {
  const items = useRef<(HTMLElement | null)[]>([]);
  const [progress, setProgress] = useState(0);

  const setItemRef = useCallback(
    (index: number) => (element: HTMLElement | null) => {
      items.current[index] = element;
    },
    [],
  );

  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const middle = (rect: DOMRect) =>
        axis === 'x' ? rect.left + rect.width / 2 : rect.top + rect.height / 2;

      const anchor = anchorRef.current?.getBoundingClientRect();
      const viewport = axis === 'x' ? window.innerWidth : window.innerHeight;
      const line = anchor ? middle(anchor) : viewport / 2;

      const centers: number[] = [];
      for (let i = 0; i < count; i++) {
        const rect = items.current[i]?.getBoundingClientRect();
        if (!rect) return;
        centers.push(middle(rect));
      }
      if (centers.length < 2) return;

      const last = centers.length - 1;
      if (line <= centers[0]) {
        setProgress(0);
        return;
      }
      if (line >= centers[last]) {
        setProgress(last);
        return;
      }
      for (let i = 0; i < last; i++) {
        const from = centers[i];
        const to = centers[i + 1];
        if (line >= from && line <= to) {
          setProgress(to === from ? i : i + (line - from) / (to - from));
          return;
        }
      }
    };

    const request = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    request();
    // scroll events do not bubble, so capture them from whichever container scrolls
    window.addEventListener('scroll', request, true);
    window.addEventListener('resize', request);
    const observer = new ResizeObserver(request);
    for (const item of items.current) {
      if (item) observer.observe(item);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', request, true);
      window.removeEventListener('resize', request);
      observer.disconnect();
    };
  }, [axis, count, anchorRef]);

  return { progress, setItemRef };
};

export default useTimelineProgress;
