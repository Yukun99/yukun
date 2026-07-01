import { getColor, GRAY, OPACITY } from '@/app/palette';
import SectionTitle from '@/common/components/sections/section-title';
import { useSpacing } from '@/pages/page';
import Box from '@mui/material/Box';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { ReactNode } from 'react';

const FROSTED_BG = `
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

export type SectionProps = {
  title?: string;
  page?: string;
  width?: number | string;
  style?: SystemStyleObject<Theme>;
  centered?: boolean;
  blurless?: boolean;
  snug?: boolean;
  children?: ReactNode;
};

const Section = ({
  title,
  page,
  width,
  style,
  centered,
  blurless,
  snug,
  children,
}: SectionProps) => {
  const { margin, padding } = useSpacing();

  return (
    <Box
      sx={{
        width,
        display: width ? undefined : 'flex',
        flexDirection: width ? undefined : 'column',
        alignItems: centered ? 'center' : undefined,
        justifyContent: centered ? 'center' : undefined,
        margin: snug ? undefined : `${margin}px`,
        padding: `${padding}px`,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: `${padding}px`,
        boxShadow: (theme) => theme.shadows[16],
        backdropFilter: blurless ? undefined : 'blur(20px) saturate(250%)',
        WebkitBackdropFilter: blurless ? undefined : 'blur(20px) saturate(250%)',
        background: FROSTED_BG,
        ...style,
      }}
    >
      {page && title && <SectionTitle title={title} page={page} underline />}
      {children}
    </Box>
  );
};

export default Section;
