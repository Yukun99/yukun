import { useScrollViewport } from '@/common/contexts/scroll-context';
import useSettledScroll from '@/common/hooks/use-settled-scroll';

export const SNAP_ATTRIBUTE = 'data-scroll-snap';

const SETTLE_DELAY = 50;
const REACH = 0.4;
const DEAD_ZONE = 4;

const snapToNearest = (viewport: HTMLElement, behavior: ScrollBehavior) => {
  const top = viewport.getBoundingClientRect().top;

  // the top of the page counts as a target, so a near-top rest settles into frame
  let closest = -viewport.scrollTop;
  viewport.querySelectorAll<HTMLElement>(`[${SNAP_ATTRIBUTE}]`).forEach((target) => {
    const distance = target.getBoundingClientRect().top - top;
    if (Math.abs(distance) < Math.abs(closest)) closest = distance;
  });

  if (Math.abs(closest) > viewport.clientHeight * REACH) return;
  if (Math.abs(closest) < DEAD_ZONE) return;
  viewport.scrollBy({ top: closest, behavior });
};

// lands the app scroll container on the nearest [data-scroll-snap] element within reach
const useScrollSnap = (enabled = true) => {
  const viewport = useScrollViewport();
  useSettledScroll(enabled ? viewport : null, snapToNearest, SETTLE_DELAY);
};

export default useScrollSnap;
