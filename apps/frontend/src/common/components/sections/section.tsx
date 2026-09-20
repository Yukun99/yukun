import { getColor, GRAY, OPACITY } from '@/common/utils/palette';
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

export type SectionStyleProps = {
  width?: number | string;
  style?: SystemStyleObject<Theme>;
  centered?: boolean;
  blurless?: boolean;
  clear?: boolean;
  snug?: boolean;
  tight?: boolean;
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
  style,
  centered,
  blurless,
  clear,
  snug,
  tight,
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
        display: width ? undefined : 'flex',
        flexDirection: width ? undefined : 'column',
        alignItems: centered ? 'center' : undefined,
        justifyContent: centered ? 'center' : undefined,
        margin: snug ? undefined : `${margin}px`,
        padding: tight ? undefined : `${padding}px`,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: `${padding}px`,
        boxShadow: (theme) => theme.shadows[16],
        backdropFilter: blurless || clear ? undefined : 'blur(20px) saturate(250%)',
        WebkitBackdropFilter: blurless || clear ? undefined : 'blur(20px) saturate(250%)',
        background: clear ? undefined : FROSTED_BG,
        ...revealSx,
        ...style,
      }}
    >
      {page && title && <SectionTitle title={title} page={page} underline />}
      {children}
    </Box>
  );
};

export default Section;