import Box from '@mui/material/Box';
import React from 'react';
import { getColor, GRAY, OPACITY } from '@/app/palette';

type HomeSectionProps = { width: number | string; children: React.ReactNode };

const HomeSection = ({ width, children }: HomeSectionProps) => {
  return (
    <Box
      sx={{
        width,
        margin: '24px',
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
      }}
    >
      {children}
    </Box>
  );
};

export default HomeSection;