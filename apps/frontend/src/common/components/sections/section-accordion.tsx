import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import SectionTitle from '@/common/components/sections/section-title';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactNode } from 'react';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import { GLOBAL_PADDING } from '@/pages/page';
import { isMobileOnly } from 'react-device-detect';

type SectionAccordionProps = {
  title: string;
  page: string;
  accordionNumber: number;
  expandedAccordion: number | undefined;
  setExpandedAccordion: (accordionNumber: number | undefined) => void;
  children: ReactNode;
};

const SectionAccordion = ({
  title,
  page,
  accordionNumber,
  expandedAccordion,
  setExpandedAccordion,
  children,
}: SectionAccordionProps) => {
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
      <AccordionDetails
        sx={{ display: 'flex', justifyContent: isMobileOnly ? 'center' : undefined, padding: 0 }}
      >
        <Box sx={{ paddingY: `${GLOBAL_PADDING}px` }}>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default SectionAccordion;