import { useAccordionGroup } from '@/common/components/sections/section-accordion-group';
import SectionTitle from '@/common/components/sections/section-title';
import useSpacing from '@/common/hooks/use-spacing';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';

type SectionAccordionProps = {
  title: string;
  page: string;
  centered?: boolean;
  column?: boolean;
  children: ReactNode;
};

const SectionAccordion = ({ title, page, centered, column, children }: SectionAccordionProps) => {
  const { margin } = useSpacing();
  const { expanded, toggle } = useAccordionGroup();

  return (
    <Accordion
      sx={{ bgcolor: 'transparent', backgroundImage: 'none', border: 'none', boxShadow: 'none' }}
      disableGutters
      expanded={expanded === title}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
        onClick={() => toggle(title)}
      >
        <SectionTitle page={page} title={title} variant='h5' />
      </AccordionSummary>
      <AccordionDetails sx={{ padding: 0 }}>
        <Box
          sx={{
            paddingY: `${margin}px`,
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: centered ? 'center' : undefined,
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
