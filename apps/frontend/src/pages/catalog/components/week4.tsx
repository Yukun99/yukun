import Reveal from '@/common/components/effects/reveal';
import Section from '@/common/components/sections/section';
import useIsMobile from '@/common/hooks/use-is-mobile';
import SkeletonSection from '@/common/skeletons/sk-section';
import useSpacing from '@/common/hooks/use-spacing';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';

const SIZE = 100;
const DURATION = 2000;

const Week4Example = () => {
  const isMobile = useIsMobile();
  const { padding } = useSpacing();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setLoaded(true);
    }, 500);
  }, []);

  const slotSize = SIZE + padding * 2;

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'center',
        gap: `${padding}px`,
      }}
    >
      <Reveal trigger='mount'>
        <Section snug>
          <Box sx={{ width: `${SIZE}px`, height: `${SIZE}px` }} />
        </Section>
      </Reveal>

      <SkeletonSection snug minHeight={slotSize} minWidth={slotSize} duration={DURATION}>
        {loaded && (
          <Section snug reveal='mount' revealDuration={DURATION}>
            <Box sx={{ width: `${SIZE}px`, height: `${SIZE}px` }} />
          </Section>
        )}
      </SkeletonSection>
    </Box>
  );
};

export default Week4Example;