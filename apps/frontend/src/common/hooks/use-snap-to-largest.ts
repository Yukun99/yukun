import { useScrollViewport } from '@/common/contexts/scroll-context';
import { watchPointerHold } from '@/common/utils/pointer-hold';
import { RefObject, useEffect } from 'react';

export const PANE_ATTRIBUTE = 'data-snap-pane';

const SETTLE_DELAY = 125;
const DOMINANT = 0.5;
const DEAD_ZONE = 4;

/**
 * once scrolling has settled, brings the [data-snap-pane] element covering most of the container
 * fully into frame, along the given axis
 */
const useSnapToLargest = (axis: 'x' | 'y', containerRef?: RefObject<HTMLElement | null>) => {
  const getScrollViewport = useScrollViewport();

  useEffect(() => {
    let frame = 0;
    let timer = 0;
    let container: HTMLElement | null = null;

    const settle = () => {
      if (!container || hold.isHeld()) return;
      const box = container.getBoundingClientRect();
      const start = axis === 'x' ? box.left : box.top;
      const size = axis === 'x' ? container.clientWidth : container.clientHeight;

      let leader: HTMLElement | null = null;
      let covered = 0;
      container.querySelectorAll<HTMLElement>(`[${PANE_ATTRIBUTE}]`).forEach((pane) => {
        const rect = pane.getBoundingClientRect();
        const paneStart = axis === 'x' ? rect.left : rect.top;
        const paneEnd = axis === 'x' ? rect.right : rect.bottom;
        const visible = Math.min(paneEnd, start + size) - Math.max(paneStart, start);
        if (visible > covered) {
          covered = visible;
          leader = pane;
        }
      });

      // nothing owns the screen right now, so leave the scroll where the reader put it
      if (!leader || covered < size * DOMINANT) return;

      const rect = (leader as HTMLElement).getBoundingClientRect();
      const offset = (axis === 'x' ? rect.left : rect.top) - start;
      if (Math.abs(offset) < DEAD_ZONE) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      container.scrollBy({
        [axis === 'x' ? 'left' : 'top']: offset,
        behavior: reduced ? 'auto' : 'smooth',
      });
    };

    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, SETTLE_DELAY);
    };

    const hold = watchPointerHold(onScroll);

    const listen = () => {
      container = containerRef?.current ?? getScrollViewport();
      // both the scrollbar wrapper and the pane row mount deferred
      if (!container) {
        frame = requestAnimationFrame(listen);
        return;
      }
      container.addEventListener('scroll', onScroll, { passive: true });
    };

    listen();

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      hold.stop();
      container?.removeEventListener('scroll', onScroll);
    };
  }, [axis, containerRef, getScrollViewport]);
};

export default useSnapToLargest;
