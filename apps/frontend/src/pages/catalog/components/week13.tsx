import { OPACITY } from '@/common/utils/palette';
import FloatingCircles from '@/common/components/effects/floating-circles';
import Section from '@/common/components/sections/section';
import SectionAccordion from '@/common/components/sections/section-accordion';
import SectionAccordionGroup from '@/common/components/sections/section-accordion-group';
import SectionDividerHor from '@/common/components/sections/section-divider-hor';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useSpacing from '@/common/hooks/use-spacing';
import { PAGE } from '@/pages/catalog/utils/page';
import Box from '@mui/material/Box';

const SECTION_HEIGHT = 400;
const PANEL_HEIGHT = 500;

type CirclePanelProps = { count: number };

const CirclePanel = ({ count }: CirclePanelProps) => {
  const { padding } = useSpacing();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: PANEL_HEIGHT,
        overflow: 'hidden',
        borderRadius: `${padding}px`,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <FloatingCircles count={count} opacity={OPACITY[50]} contained />
    </Box>
  );
};

const Week13Example = () => {
  const isMobile = useIsMobile();

  return (
    <Section variant='flat' noMargin sx={{ width: '100%', height: SECTION_HEIGHT }}>
      <SectionAccordionGroup>
        <SectionAccordion title='week13.few' page={PAGE}>
          <CirclePanel count={isMobile ? 6 : 12} />
        </SectionAccordion>
        <SectionDividerHor slim />
        <SectionAccordion title='week13.many' page={PAGE}>
          <CirclePanel count={isMobile ? 30 : 60} />
        </SectionAccordion>
        <SectionDividerHor slim />
      </SectionAccordionGroup>
    </Section>
  );
};

export default Week13Example;
