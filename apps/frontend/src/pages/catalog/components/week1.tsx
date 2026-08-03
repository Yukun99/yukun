import Section from '@/common/components/sections/section';
import useIsMobile from '@/common/hooks/use-is-mobile';
import Box from '@mui/material/Box';

const Week1Example = () => {
  const isMobile = useIsMobile();

  return (
    <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center' }}>
      <Section>
        <Box sx={{ width: '100px', height: '100px' }} />
      </Section>
      <Section>
        <Box sx={{ width: '100px', height: '100px' }} />
      </Section>
    </Box>
  );
};

export default Week1Example;