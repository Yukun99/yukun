import Box from '@mui/material/Box';
import React from 'react';
import { getColor, GRAY, OPACITY } from '@/app/palette';

type HomeSectionProps = { width?: number | string; children: React.ReactNode; style?: any };

const HomeSection = ({ width, children, style }: HomeSectionProps) => {
  return (
    <Box
      sx={{
        width,
        display: width ? undefined : 'flex',
        flexDirection: width ? undefined : 'column',
        margin: '16px',
        padding: '24px',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '24px',
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
      {children}
    </Box>
  );
};

export default HomeSection;