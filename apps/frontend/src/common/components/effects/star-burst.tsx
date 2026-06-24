import { type MouseEvent, type Ref, useImperativeHandle, useState } from 'react';
import Box from '@mui/material/Box';
import { keyframes } from '@mui/system';

const STAR_COUNT = 5;
const STAR_SPEED = 0.05;
const STAR_DIST_MIN = 10;
const STAR_DIST_MULT = 30;

const fall = keyframes`
  0%   { opacity: 1; transform: rotate(var(--a)) translateX(0)        scale(1); }
  100% { opacity: 0; transform: rotate(var(--a)) translateX(var(--d)) scale(0.4); }
`;
type StarProps = { id: number; ox: number; oy: number; angle: number; dist: number; dur: number };
const spawnStars = (offsetX: number, offsetY: number): StarProps[] => {
  const now = Date.now();
  return Array.from({ length: STAR_COUNT }, (_, i) => {
    const dist = STAR_DIST_MIN + Math.random() * STAR_DIST_MULT;
    return {
      id: now + i,
      ox: offsetX,
      oy: offsetY,
      angle: Math.random() * Math.PI * 2,
      dist,
      dur: dist / STAR_SPEED,
    };
  });
};

export type StarBurstHandle = { burst: (e: MouseEvent<HTMLElement>) => void };
type StarBurstProps = { size: number; ref?: Ref<StarBurstHandle> };

const StarBurst = ({ size, ref }: StarBurstProps) => {
  const [stars, setStars] = useState<StarProps[]>([]);

  useImperativeHandle(ref, () => ({
    burst: (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setStars((prev) => [...prev, ...spawnStars(e.clientX - rect.left, e.clientY - rect.top)]);
    },
  }));

  const onRemove = (id: number) => setStars((prev) => prev.filter((s) => s.id !== id));

  return (
    <>
      {stars.map((s) => (
        <Box
          key={s.id}
          component='span'
          sx={{
            position: 'absolute',
            top: s.oy,
            left: s.ox,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }}
        >
          <Box
            component='span'
            onAnimationEnd={() => onRemove(s.id)}
            sx={{
              display: 'inline-block',
              fontSize: size * 0.35,
              lineHeight: 1,
              color: 'text.primary',
              animation: `${fall} ${s.dur}ms ease-out forwards`,
              '--a': `${s.angle}rad`,
              '--d': `${s.dist}px`,
            }}
          >
            *
          </Box>
        </Box>
      ))}
    </>
  );
};

export default StarBurst;