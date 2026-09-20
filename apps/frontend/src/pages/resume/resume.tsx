import useIsMobile from '@/common/hooks/use-is-mobile';
import { SNAP_ATTRIBUTE } from '@/common/hooks/use-scroll-snap';
import Page from '@/pages/page';
import SkillDialog from '@/pages/resume/components/skill-dialog';
import ContactSection from '@/pages/resume/sections/contact-section';
import EducationSection from '@/pages/resume/sections/education-section';
import ExperienceTimelineSection from '@/pages/resume/sections/experience-timeline-section';
import SkillsSection from '@/pages/resume/sections/skills-section';
import { DialogContentRenderer } from '@/pages/resume/utils/skill-button-utils';
import Box from '@mui/material/Box';
import { useState } from 'react';

const Resume = () => {
  const isMobile = useIsMobile();
  const [dialogContentRenderer, setDialogContentRenderer] = useState<DialogContentRenderer | null>(
    null,
  );

  const showDialog = (renderer: DialogContentRenderer) => setDialogContentRenderer(() => renderer);

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
  const skills = <SkillsSection onSelectSkill={showDialog} style={paneStyle} />;

  return (
    <Page>
      <ExperienceTimelineSection
        onSelectSkill={showDialog}
        trailing={isMobile ? [details, skills] : undefined}
      />
      {!isMobile && details}
      {!isMobile && skills}
      <SkillDialog
        content={dialogContentRenderer?.(isMobile)}
        onClose={() => setDialogContentRenderer(null)}
      />
    </Page>
  );
};

export default Resume;
