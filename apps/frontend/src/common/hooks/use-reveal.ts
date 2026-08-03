import type { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import type { SystemStyleObject } from '@mui/system';
import { useEffect, useRef, useState } from 'react';

export type RevealTrigger = 'mount' | 'scroll' | false;

/**
 * on: type of reveal trigger, whether it's on component mount, scroll into view, or nothing
 * distance: travel distance
 * duration: travel duration
 * delay: travel/fade start delay
 * repeat: whether to replay animation everytime element scrolls in/out of view
 */
export type RevealOptions = {
  trigger?: RevealTrigger;
  distance?: number;
  duration?: number;
  delay?: number;
  repeat?: boolean;
};

const DISTANCE = '--reveal-distance';
export const REVEAL_EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';
export const REVEAL_DURATION = 1000;

const useReveal = ({
  trigger = 'mount',
  distance = 10,
  duration = REVEAL_DURATION,
  delay = 0,
  repeat = false,
}: RevealOptions = {}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  const [shown, setShown] = useState(trigger !== 'scroll');

  useEffect(() => {
    // not scroll into view, automatically show
    if (trigger !== 'scroll') {
      setShown(true);
      return;
    }

    // nothing to show, just return
    const element = ref.current;
    if (!element) return;

    // scroll into view observer
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          if (!repeat) observer.disconnect();
        } else if (repeat) {
          setShown(false);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [trigger, repeat]);

  // no trigger specified / for accessibility purposes, don't use animations
  if (!trigger || reduced) return { ref, sx: {} as SystemStyleObject<Theme> };

  const sx = {
    [DISTANCE]: `${distance}px`,
    '@keyframes reveal-rise': {
      from: { opacity: 0, transform: `translate3d(0, var(${DISTANCE}), 0)` },
      to: { opacity: 1, transform: 'translate3d(0, 0, 0)' },
    },
    ...(shown
      ? {
          animation: `reveal-rise ${duration}ms ${REVEAL_EASE} ${delay}ms both`,
          willChange: 'opacity, transform',
        }
      : { opacity: 0, transform: `translate3d(0, var(${DISTANCE}), 0)` }),
  } as SystemStyleObject<Theme>;

  return { ref, sx };
};

export default useReveal;