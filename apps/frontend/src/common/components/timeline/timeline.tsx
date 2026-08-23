import { getColor, GRAY, OPACITY, PURPLE } from '@/app/palette';
import { REVEAL_EASE } from '@/common/hooks/use-reveal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { RefObject } from 'react';

export type TimelineEntry = { key: string; year: string; label: string };
export type TimelineOrientation = 'vertical' | 'horizontal';

const STRIP_HEIGHT = 64;

const SPACING = { vertical: 132, horizontal: 168 };
const SPAN = 2.2;
// the horizontal dial stays flatter so it eats less of a landscape phone's height
const MIN_SCALE = { vertical: 0.4, horizontal: 0.75 };
const CURVE = { vertical: 7, horizontal: 2 };
const RIB = { vertical: 34, horizontal: 12 };

const fadeGradient = (angle: number) => `linear-gradient(
  ${angle}deg,
  ${getColor(PURPLE[0], OPACITY[0])},
  ${getColor(PURPLE[0], OPACITY[65])} 35%,
  ${getColor(PURPLE[0], OPACITY[65])} 65%,
  ${getColor(PURPLE[0], OPACITY[0])}
)`;

const ribGradient = (angle: number) => `linear-gradient(
  ${angle}deg,
  ${getColor(PURPLE[0], OPACITY[70])},
  ${getColor(PURPLE[0], OPACITY[0])}
)`;

type TimelineProps = {
  entries: TimelineEntry[];
  progress: number;
  orientation?: TimelineOrientation;
  ref?: RefObject<HTMLDivElement | null>;
};

const Timeline = ({ entries, progress, orientation = 'vertical', ref }: TimelineProps) => {
  const horizontal = orientation === 'horizontal';
  const spacing = SPACING[orientation];

  return (
    <Box
      ref={ref}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        ...(horizontal
          ? { width: '100%', height: `${STRIP_HEIGHT}px` }
          : {
              position: 'sticky',
              top: '12dvh',
              alignSelf: 'flex-start',
              width: '220px',
              height: '72dvh',
            }),
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          background: fadeGradient(horizontal ? 90 : 180),
          ...(horizontal
            ? { left: 0, right: 0, top: '10px', height: '2px' }
            : { top: 0, bottom: 0, right: `${RIB.vertical}px`, width: '2px' }),
        }}
      />
      {entries.map((entry, index) => {
        const distance = index - progress;
        const fade = Math.min(Math.abs(distance) / SPAN, 1);
        const scale = 1 - (1 - MIN_SCALE[orientation]) * fade;
        const slide = distance * spacing;
        // pushes entries away from the reader as they leave the centre, like the rim of a dial
        const drift = -(distance * distance) * CURVE[orientation];

        return (
          <Box
            key={entry.key}
            sx={{
              position: 'absolute',
              display: 'flex',
              opacity: (1 - fade) ** 1.6,
              transition: `transform 120ms linear, opacity 120ms ${REVEAL_EASE}`,
              pointerEvents: 'none',
              ...(horizontal
                ? {
                    top: '6px',
                    left: '50%',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2px',
                    transformOrigin: 'center top',
                    transform: `translate3d(calc(-50% + ${slide}px), ${drift}px, 0) scale(${scale})`,
                  }
                : {
                    top: '50%',
                    left: 0,
                    right: `${RIB.vertical}px`,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '8px',
                    transformOrigin: 'right center',
                    transform: `translate3d(${drift}px, calc(-50% + ${slide}px), 0) scale(${scale})`,
                  }),
            }}
          >
            {horizontal && (
              <Box
                sx={{ width: '2px', height: `${RIB.horizontal}px`, background: ribGradient(180) }}
              />
            )}
            <Box sx={{ textAlign: horizontal ? 'center' : 'right' }}>
              <Typography
                variant={horizontal ? 'h6' : 'h5'}
                sx={{ fontWeight: 500, lineHeight: horizontal ? 1 : 1.2 }}
              >
                {entry.year}
              </Typography>
              <Typography
                variant='caption'
                sx={{
                  display: 'block',
                  color: getColor(GRAY[50], OPACITY[100]),
                  whiteSpace: 'nowrap',
                  lineHeight: 1,
                  marginTop: horizontal ? '5px' : undefined,
                }}
              >
                {entry.label}
              </Typography>
            </Box>
            {!horizontal && (
              <Box
                sx={{ width: `${RIB.vertical * 2}px`, height: '2px', background: ribGradient(90) }}
              />
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default Timeline;
