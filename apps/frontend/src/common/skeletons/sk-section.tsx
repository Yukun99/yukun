import { getColor, GRAY, OPACITY } from '@/app/palette';
import { SectionStyleProps } from '@/common/components/sections/section';
import { REVEAL_DURATION, REVEAL_EASE } from '@/common/hooks/use-reveal';
import { useSpacing } from '@/pages/page';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';

const FRAME_LIGHT = `linear-gradient(
  180deg,
  ${getColor(GRAY[80], OPACITY[45])},
  ${getColor(GRAY[80], OPACITY[5])}
)`;

const FRAME_DARK = `linear-gradient(
  180deg,
  ${getColor(GRAY[0], OPACITY[45])},
  ${getColor(GRAY[0], OPACITY[5])}
)`;

const FRAME_WIDTH = 2;

const HOLLOW_MASK = {
  mask: 'linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)',
  maskComposite: 'exclude',
  WebkitMask: 'linear-gradient(#000 0 0) padding-box, linear-gradient(#000 0 0)',
  WebkitMaskComposite: 'xor',
};

const reserve = (size: number | string | undefined, inset: number) => {
  if (size === undefined) return undefined;
  return typeof size === 'number' ? `${size + inset * 2}px` : `calc(${size} + ${inset * 2}px)`;
};

export type SkeletonSectionProps = Pick<SectionStyleProps, 'width' | 'style' | 'snug'> & {
  minHeight?: number | string;
  minWidth?: number | string;
  duration?: number;
  delay?: number;
  children?: ReactNode;
};

const SkeletonSection = ({
  width,
  style,
  snug,
  minHeight = 200,
  minWidth,
  duration = REVEAL_DURATION,
  delay = 0,
  children,
}: SkeletonSectionProps) => {
  const { margin, padding } = useSpacing();

  const inset = snug ? 0 : margin;

  return (
    <Box
      sx={[
        (theme) => ({
          position: 'relative',
          width,
          minHeight: reserve(minHeight, inset),
          minWidth: reserve(minWidth, inset),
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: `${inset}px`,
            borderRadius: `${padding}px`,
            border: `${FRAME_WIDTH}px solid transparent`,
            background: `${FRAME_LIGHT} border-box`,
            ...HOLLOW_MASK,
            pointerEvents: 'none',
            opacity: 1,
            transition: `opacity ${duration}ms ${REVEAL_EASE} ${delay}ms`,
            ...theme.applyStyles('dark', { background: `${FRAME_DARK} border-box` }),
          },
          '&:has(> *)::before': { opacity: 0 },
          '@media (prefers-reduced-motion: reduce)': { '&::before': { transition: 'none' } },
        }),
        ...(style ? [style] : []),
      ]}
    >
      {children}
    </Box>
  );
};

export default SkeletonSection;