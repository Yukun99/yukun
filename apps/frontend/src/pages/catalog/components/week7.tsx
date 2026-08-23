import useIsMobile from '@/common/hooks/use-is-mobile';
import NavigationMobile from '@/features/navigation/navigation-mobile';
import Box from '@mui/material/Box';
import { useRef } from 'react';

const Week7Example = () => {
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    // the button and drawer are positioned, so they need a box of their own to sit inside
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: isMobile ? '240px' : '340px',
      }}
    >
      <NavigationMobile contained containerRef={containerRef} />
    </Box>
  );
};

export default Week7Example;
