import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import SectionTitle from '@/common/components/sections/section-title';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ReactNode } from 'react';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import { GLOBAL_PADDING } from '@/pages/page';
import { isMobileOnly } from 'react-device-detect';

type SectionAccordionProps = { title: string; page: string; children: ReactNode };

const SectionAccordion = ({ title, page, children }: SectionAccordionProps) => {
  return (
    <Accordion sx={{ bgcolor: 'transparent', border: 'none', boxShadow: 'none' }} disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <SectionTitle page={page} title={title} variant='h5' />
      </AccordionSummary>
      <AccordionDetails
        sx={{ display: 'flex', justifyContent: isMobileOnly ? 'center' : undefined }}
      >
        <Box sx={{ paddingBottom: `${GLOBAL_PADDING}px` }}>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
};

export default SectionAccordion;