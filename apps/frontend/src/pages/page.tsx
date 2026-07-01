import useIsMobile from '@/common/hooks/use-is-mobile';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';

export const useSpacing = () => {
  const isMobile = useIsMobile();
  return { margin: isMobile ? 8 : 16, padding: isMobile ? 18 : 24 };
};

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
