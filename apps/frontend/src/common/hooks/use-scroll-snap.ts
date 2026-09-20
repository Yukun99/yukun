import { useScrollViewport } from '@/common/contexts/scroll-context';
import { watchPointerHold } from '@/common/utils/pointer-hold';
import { useEffect } from 'react';

export const SNAP_ATTRIBUTE = 'data-scroll-snap';

const SETTLE_DELAY = 50;
const REACH = 0.4;
const DEAD_ZONE = 4;

/**
 * settles the app scroll container onto the nearest [data-scroll-snap] element once the user
 * has stopped scrolling, instead of snapping mid-gesture the way css scroll-snap does
 */
const useScrollSnap = (enabled = true) => {
  const getScrollViewport = useScrollViewport();

  useEffect(() => {
    if (!enabled) return;

    let frame = 0;
    let timer = 0;
    let viewport: HTMLElement | null = null;

    const settle = () => {
      if (!viewport || hold.isHeld()) return;
      const top = viewport.getBoundingClientRect().top;
      const targets = viewport.querySelectorAll<HTMLElement>(`[${SNAP_ATTRIBUTE}]`);

      // the top of the page counts as a target, so a near-top rest settles into frame
      let closest = -viewport.scrollTop;
      targets.forEach((target) => {
        const distance = target.getBoundingClientRect().top - top;
        if (Math.abs(distance) < Math.abs(closest)) closest = distance;
      });

      if (Math.abs(closest) > viewport.clientHeight * REACH) return;
      if (Math.abs(closest) < DEAD_ZONE) return;

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      viewport.scrollTo({
        top: viewport.scrollTop + closest,
        behavior: reduced ? 'auto' : 'smooth',
      });
    };

    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, SETTLE_DELAY);
    };

    const hold = watchPointerHold(onScroll);

    const listen = () => {
      viewport = getScrollViewport();
      // the scrollbar wrapper mounts deferred, so keep looking until its viewport exists
      if (!viewport) {
        frame = requestAnimationFrame(listen);
        return;
      }
      viewport.addEventListener('scroll', onScroll, { passive: true });
    };

    listen();

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
      hold.stop();
      viewport?.removeEventListener('scroll', onScroll);
    };
  }, [enabled, getScrollViewport]);
};

export default useScrollSnap;