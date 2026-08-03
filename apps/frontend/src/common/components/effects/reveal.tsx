import useReveal, { RevealOptions } from '@/common/hooks/use-reveal';
import Box from '@mui/material/Box';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { ReactNode } from 'react';

export type RevealProps = RevealOptions & { children: ReactNode; style?: SystemStyleObject<Theme> };

const Reveal = ({ children, style, ...options }: RevealProps) => {
  const { ref, sx } = useReveal(options);

  return (
    <Box ref={ref} sx={{ ...sx, ...style }}>
      {children}
    </Box>
  );
};

export default Reveal;