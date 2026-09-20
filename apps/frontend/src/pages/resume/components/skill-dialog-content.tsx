import Section from '@/common/components/sections/section';
import SectionDividerHor from '@/common/components/sections/section-divider-hor';
import SectionTitle from '@/common/components/sections/section-title';
import useIsMobile from '@/common/hooks/use-is-mobile';
import { PAGE } from '@/pages/resume/utils/page';
import { technicalIcons } from '@/pages/resume/utils/skill-icons';
import { TechnicalSkill } from '@/pages/resume/utils/skill-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

type SkillDialogContentProps = { skill: TechnicalSkill };

const SkillDialogContent = ({ skill }: SkillDialogContentProps) => {
  const { t } = useTranslation(PAGE);
  const isMobile = useIsMobile();
  const Icon = technicalIcons[skill.icon];
  const labelVariant = isMobile ? 'subtitle1' : 'h5';
  const panelStyle = isMobile ? { padding: '8px' } : undefined;

  return (
    <Section centered blurless snug style={isMobile ? { height: '78dvh' } : undefined}>
      <SectionTitle message={skill.name} variant={labelVariant} />
      <SectionDividerHor />
      {/* the icon takes whatever height the labels leave behind */}
      <Box
        sx={{
          display: 'flex',
          flex: isMobile ? 1 : undefined,
          minHeight: 0,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon size={isMobile ? '100%' : '20%'} />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <Section centered blurless style={panelStyle}>
          <SectionTitle message={t('skills.technical.durationLabel')} variant={labelVariant} />
          <Typography variant={isMobile ? 'body2' : 'body1'}>{skill.duration}</Typography>
        </Section>
        <Section centered blurless style={panelStyle}>
          <SectionTitle message={t('skills.technical.proficiencyLabel')} variant={labelVariant} />
          <Typography variant={isMobile ? 'body2' : 'body1'}>{skill.proficiency}</Typography>
        </Section>
      </Box>
    </Section>
  );
};

export default SkillDialogContent;
