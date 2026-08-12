import { OPACITY, PURPLE } from '@/app/palette';
import useFloatingCircles from '@/common/hooks/use-floating-circles';
import useIsMobile from '@/common/hooks/use-is-mobile';
import Box from '@mui/material/Box';

const CIRCLE_COUNT = 18;
const CIRCLE_COUNT_MOBILE = 9;

const CIRCLE_COLORS = [PURPLE[0], PURPLE[1], PURPLE[2], PURPLE[3], PURPLE[4], '#5F8FEE', '#FF5FD1'];

type FloatingCircleProps = { count?: number; opacity?: number };

const FloatingCircles = ({ count, opacity = OPACITY[10] }: FloatingCircleProps) => {
  const isMobile = useIsMobile();
  count = count ? count : isMobile ? CIRCLE_COUNT_MOBILE : CIRCLE_COUNT;
  const { containerRef, nodesRef } = useFloatingCircles(count);

  return (
    <Box
      ref={containerRef}
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
        pointerEvents: 'none',
        opacity: opacity,
      }}
    >
      {Array.from({ length: count }, (_, i) => (
        <Box
          key={i}
          ref={(el: HTMLDivElement | null) => {
            nodesRef.current[i] = el;
          }}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            borderRadius: '50%',
            backgroundColor: CIRCLE_COLORS[i % CIRCLE_COLORS.length],
            willChange: 'transform',
          }}
        />
      ))}
    </Box>
  );
};

export default FloatingCircles;