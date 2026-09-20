import useIsMobile from '@/common/hooks/use-is-mobile';
import { SNAP_ATTRIBUTE } from '@/common/hooks/use-scroll-snap';
import Page from '@/pages/page';
import SkillDialog from '@/pages/resume/components/skill-dialog';
import ContactSection from '@/pages/resume/sections/contact-section';
import EducationSection from '@/pages/resume/sections/education-section';
import ExperienceTimelineSection from '@/pages/resume/sections/experience-timeline-section';
import SkillsSection from '@/pages/resume/sections/skills-section';
import { TechnicalSkill } from '@/pages/resume/utils/skill-types';
import Box from '@mui/material/Box';
import { useState } from 'react';

const Resume = () => {
  const isMobile = useIsMobile();
  const [skill, setSkill] = useState<TechnicalSkill | null>(null);

  // panes on touch fill their slot and scroll inside their own panel
  const paneStyle = isMobile ? { flex: 1, minHeight: 0, overflowY: 'auto' as const } : undefined;

  const details = (
    <Box
      {...(isMobile ? {} : { [SNAP_ATTRIBUTE]: true })}
      sx={{
        display: 'flex',
        width: '100%',
        flex: isMobile ? 1 : undefined,
        minHeight: 0,
        flexDirection: 'row',
      }}
    >
      <ContactSection style={paneStyle} />
      <EducationSection style={paneStyle} />
    </Box>
  );
  const skills = <SkillsSection onSelectSkill={setSkill} style={paneStyle} />;

  return (
    <Page>
      <ExperienceTimelineSection
        onSelectSkill={setSkill}
        trailing={isMobile ? [details, skills] : undefined}
      />
      {!isMobile && details}
      {!isMobile && skills}
      <SkillDialog skill={skill} onClose={() => setSkill(null)} />
    </Page>
  );
};

export default Resume;
