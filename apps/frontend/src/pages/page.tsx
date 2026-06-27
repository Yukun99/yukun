import Box from '@mui/material/Box';
import { ReactNode } from 'react';
import { isMobileOnly } from 'react-device-detect';

export const GLOBAL_MARGIN = isMobileOnly ? 8 : 16;
export const GLOBAL_PADDING = isMobileOnly ? 18 : 24;

type PageProps = { children: ReactNode };

const Page = ({ children }: PageProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        margin: `${GLOBAL_MARGIN}px`,
        width: `calc(100vw - ${GLOBAL_MARGIN * 2}px)`,
      }}
    >
      {children}
    </Box>
  );
};

export default Page;