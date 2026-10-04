import { watchPointerHold } from '@/common/utils/pointer-hold';
import { useEffect } from 'react';

export type SettleHandler = (container: HTMLElement, behavior: ScrollBehavior) => void;

/**
 * calls onSettle once the container has rested for `delay` ms with no finger or button held
 * down, so a snap waits for the reader to let go instead of fighting the gesture
 */
const useSettledScroll = (
  container: HTMLElement | null,
  onSettle: SettleHandler,
  delay: number,
) => {
  useEffect(() => {
    if (!container) return;
    let timer = 0;

    const settle = () => {
      if (hold.isHeld()) return;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      onSettle(container, reduced ? 'auto' : 'smooth');
    };

    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(settle, delay);
    };

    const hold = watchPointerHold(onScroll);
    container.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.clearTimeout(timer);
      hold.stop();
      container.removeEventListener('scroll', onScroll);
    };
  }, [container, onSettle, delay]);
};

export default useSettledScroll;
