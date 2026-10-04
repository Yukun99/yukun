import { useScrollViewport } from '@/common/contexts/scroll-context';
import useSettledScroll from '@/common/hooks/use-settled-scroll';
import { useCallback } from 'react';

export const PANE_ATTRIBUTE = 'data-snap-pane';

const SETTLE_DELAY = 125;
const DOMINANT = 0.5;
const DEAD_ZONE = 4;

type Axis = 'x' | 'y';

const frameLargest = (container: HTMLElement, axis: Axis, behavior: ScrollBehavior) => {
  const box = container.getBoundingClientRect();
  const start = axis === 'x' ? box.left : box.top;
  const size = axis === 'x' ? container.clientWidth : container.clientHeight;

  let leader: HTMLElement | null = null;
  let covered = 0;
  for (const pane of Array.from(container.querySelectorAll<HTMLElement>(`[${PANE_ATTRIBUTE}]`))) {
    const rect = pane.getBoundingClientRect();
    const paneStart = axis === 'x' ? rect.left : rect.top;
    const paneEnd = axis === 'x' ? rect.right : rect.bottom;
    const visible = Math.min(paneEnd, start + size) - Math.max(paneStart, start);
    if (visible > covered) {
      covered = visible;
      leader = pane;
    }
  }

  // nothing owns the screen right now, so leave the scroll where the reader put it
  if (!leader || covered < size * DOMINANT) return;

  const rect = leader.getBoundingClientRect();
  const offset = (axis === 'x' ? rect.left : rect.top) - start;
  if (Math.abs(offset) < DEAD_ZONE) return;
  container.scrollBy({ [axis === 'x' ? 'left' : 'top']: offset, behavior });
};

/**
 * frames the [data-snap-pane] element covering most of the container along the given axis;
 * the container defaults to the app scroll viewport
 */
const useSnapToLargest = (axis: Axis, container?: HTMLElement | null) => {
  const viewport = useScrollViewport();
  const settle = useCallback(
    (target: HTMLElement, behavior: ScrollBehavior) => frameLargest(target, axis, behavior),
    [axis],
  );
  useSettledScroll(container === undefined ? viewport : container, settle, SETTLE_DELAY);
};

export default useSnapToLargest;
