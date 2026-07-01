import useIsMobile from '@/common/hooks/use-is-mobile';
import Page from '@/pages/page';
import SkillDialog from '@/pages/resume/components/skill-dialog';
import ContactSection from '@/pages/resume/sections/contact-section';
import EducationSection from '@/pages/resume/sections/education-section';
import ExperienceSection from '@/pages/resume/sections/experience-section';
import SkillsSection from '@/pages/resume/sections/skills-section';
import Box from '@mui/material/Box';
import { ReactNode, useState } from 'react';

export const PAGE = 'resume';

const Resume = () => {
  const isMobile = useIsMobile();
  const [skillDialogContent, setSkillDialogContent] = useState<ReactNode | undefined>(undefined);

  return (
    <Page>
      <Box sx={{ display: 'flex', width: '100%', flexDirection: isMobile ? 'column' : 'row' }}>
        <ContactSection />
        <EducationSection />
      </Box>
      <ExperienceSection />
      <SkillsSection setSkillDialogContent={setSkillDialogContent} />
      <SkillDialog content={skillDialogContent} setSkillDialogContent={setSkillDialogContent} />
    </Page>
  );
};

export default Resume;
