import useIsMobile from '@/common/hooks/use-is-mobile';
import Page from '@/pages/page';
import SkillDialog from '@/pages/resume/components/skill-dialog';
import ContactSection from '@/pages/resume/sections/contact-section';
import EducationSection from '@/pages/resume/sections/education-section';
import ExperienceSection from '@/pages/resume/sections/experience-section';
import SkillsSection from '@/pages/resume/sections/skills-section';
import { DialogContentRenderer } from '@/pages/resume/utils/skill-button-utils';
import Box from '@mui/material/Box';
import { useState } from 'react';

export const PAGE = 'resume';

const Resume = () => {
  const isMobile = useIsMobile();
  const [dialogContentRenderer, setDialogContentRenderer] = useState<DialogContentRenderer | null>(
    null,
  );

  const showDialog = (renderer: DialogContentRenderer) => setDialogContentRenderer(() => renderer);

  return (
    <Page>
      <Box sx={{ display: 'flex', width: '100%', flexDirection: isMobile ? 'column' : 'row' }}>
        <ContactSection />
        <EducationSection />
      </Box>
      <ExperienceSection />
      <SkillsSection onSelectSkill={showDialog} />
      <SkillDialog
        content={dialogContentRenderer?.(isMobile)}
        onClose={() => setDialogContentRenderer(null)}
      />
    </Page>
  );
};

export default Resume;
