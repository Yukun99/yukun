import useSpacing from '@/common/hooks/use-spacing';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';

type PageProps = { children: ReactNode };

const Page = ({ children }: PageProps) => {
  const { margin } = useSpacing();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        margin: `${margin}px`,
        width: `calc(100vw - ${margin * 2}px)`,
      }}
    >
      {children}
    </Box>
  );
};

export default Page;
