import { ReactNode } from 'react';
import { getColor, GRAY, OPACITY } from '@/app/palette';
import Box from '@mui/material/Box';
import SectionTitle from '@/common/components/sections/section-title';
import { GLOBAL_MARGIN, GLOBAL_PADDING } from '@/pages/page';

export type SectionProps = {
  title?: string;
  page?: string;
  width?: number | string;
  style?: any;
  centered?: boolean;
  children?: ReactNode;
};

const Section = ({ title, page, width, style, centered, children }: SectionProps) => {
  return (
    <Box
      sx={{
        width,
        display: width ? undefined : 'flex',
        flexDirection: width ? undefined : 'column',
        alignItems: centered ? 'center' : undefined,
        justifyContent: centered ? 'center' : undefined,
        margin: `${GLOBAL_MARGIN}px`,
        padding: `${GLOBAL_PADDING}px`,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: `${GLOBAL_PADDING}px`,
        boxShadow: (theme) => theme.shadows[16],
        backdropFilter: 'blur(20px) saturate(250%)',
        WebkitBackdropFilter: 'blur(20px) saturate(250%)',
        background: `
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
        `,
        ...style,
      }}
    >
      {page && title && <SectionTitle title={title} page={page} underline />}
      {children}
    </Box>
  );
};

export default Section;