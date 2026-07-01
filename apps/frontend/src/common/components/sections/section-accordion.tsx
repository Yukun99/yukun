import SectionTitle from '@/common/components/sections/section-title';
import useIsMobile from '@/common/hooks/use-is-mobile';
import { useSpacing } from '@/pages/page';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';

type SectionAccordionProps = {
  title: string;
  page: string;
  accordionNumber: number;
  expandedAccordion: number | undefined;
  setExpandedAccordion: (accordionNumber: number | undefined) => void;
  centered?: boolean;
  column?: boolean;
  children: ReactNode;
};

const SectionAccordion = ({
  title,
  page,
  accordionNumber,
  expandedAccordion,
  setExpandedAccordion,
  centered,
  column,
  children,
}: SectionAccordionProps) => {
  const isMobile = useIsMobile();
  const { margin } = useSpacing();

  return (
    <Accordion
      sx={{ bgcolor: 'transparent', backgroundImage: 'none', border: 'none', boxShadow: 'none' }}
      disableGutters
      expanded={accordionNumber === expandedAccordion}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        onClick={() => {
          if (accordionNumber === expandedAccordion) return setExpandedAccordion(undefined);
          return setExpandedAccordion(accordionNumber);
        }}
      >
        <SectionTitle page={page} title={title} variant='h5' />
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <Box
          sx={{
            paddingY: `${margin}px`,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: isMobile || centered ? 'center' : undefined,
            flexDirection: column ? 'column' : undefined,
          }}
        >
          {children}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default SectionAccordion;
