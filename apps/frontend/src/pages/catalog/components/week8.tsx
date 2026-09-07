import useIsMobile from '@/common/hooks/use-is-mobile';
import RotateGate from '@/features/rotate-gate/rotate-gate';
import Box from '@mui/material/Box';

const Week8Example = () => {
  const isMobile = useIsMobile();

  return (
    // the gate covers its whole positioned ancestor, so it needs a box of its own to sit inside
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: isMobile ? '240px' : '340px',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <RotateGate contained />
    </Box>
  );
};

export default Week8Example;
