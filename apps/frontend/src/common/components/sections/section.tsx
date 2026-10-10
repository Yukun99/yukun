import { getColor, GRAY, OPACITY } from '@/common/utils/palette';
import Scroller from '@/common/components/scroller';
import SectionTitle from '@/common/components/sections/section-title';
import useReveal, { RevealTrigger } from '@/common/hooks/use-reveal';
import useSpacing from '@/common/hooks/use-spacing';
import Box from '@mui/material/Box';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { ReactNode } from 'react';

export const FROSTED_BG = `
  linear-gradient(
    135deg,
    ${getColor(GRAY[30], OPACITY[20])},
    ${getColor(GRAY[70], OPACITY[10])}
  ) padding-box,
  linear-gradient(
    135deg,
    ${getColor(GRAY[30], OPACITY[20])},
    ${getColor(GRAY[70], OPACITY[10])}
  ) border-box
`;

export const BLUR = 'blur(20px) saturate(250%)';

export type SectionVariant = 'frosted' | 'flat' | 'clear';

export type SectionStyleProps = {
  width?: number | string;
  sx?: SystemStyleObject<Theme>;
  variant?: SectionVariant;
  centered?: boolean;
  noMargin?: boolean;
  noPadding?: boolean;
  reveal?: RevealTrigger;
  revealDelay?: number;
  revealDuration?: number;
};

export type SectionProps = {
  title?: string;
  page?: string;
  children?: ReactNode;
} & SectionStyleProps;

const Section = ({
  title,
  page,
  width,
  sx,
  variant = 'frosted',
  centered,
  noMargin,
  noPadding,
  reveal = false,
  revealDelay,
  revealDuration,
  children,
}: SectionProps) => {
  const { margin, padding } = useSpacing();
  const { ref, sx: revealSx } = useReveal({
    trigger: reveal,
    delay: revealDelay,
    duration: revealDuration,
  });

  return (
    <Box
      ref={ref}
      sx={{
        width,
        display: 'flex',
        flexDirection: 'column',
        margin: noMargin ? undefined : `${margin}px`,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: `${padding}px`,
        boxShadow: (theme) => theme.shadows[16],
        backdropFilter: variant === 'frosted' ? BLUR : undefined,
        WebkitBackdropFilter: variant === 'frosted' ? BLUR : undefined,
        background: variant === 'clear' ? undefined : FROSTED_BG,
        ...revealSx,
        ...sx,
      }}
    >
      {/* scrolls only when the box can't grow; the handle sits in the padding, clear of the corners */}
      <Scroller
        thickness={padding}
        inset={padding}
        viewportStyle={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: centered ? 'center' : undefined,
          justifyContent: centered ? 'safe center' : undefined,
        }}
        style={{ flex: 1, minHeight: 0, padding: noPadding ? undefined : `${padding}px` }}
      >
        {page && title && <SectionTitle title={title} page={page} underline />}
        {children}
      </Scroller>
    </Box>
  );
};

export default Section;
