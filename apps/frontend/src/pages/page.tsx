import Box from '@mui/material/Box';
import { ReactNode } from 'react';

type PageProps = { children: ReactNode };

const Page = ({ children }: PageProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        margin: '16px',
        width: 'calc(100vw - 32px)',
      }}
    >
      {children}
    </Box>
  );
};

export default Page;