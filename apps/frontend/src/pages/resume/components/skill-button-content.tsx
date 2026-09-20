import { getFormattedIcon } from '@/common/components/buttons/round-icon-button';
import useIsMobile from '@/common/hooks/use-is-mobile';
import { interestIcons, languageIcons, technicalIcons } from '@/pages/resume/utils/skill-icons';
import { SkillOf, SkillType } from '@/pages/resume/utils/skill-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';

const renderIcon: { [K in SkillType]: (skill: SkillOf[K], isMobile: boolean) => ReactNode } = {
  [SkillType.LANGUAGE]: (skill) => {
    const Icon = languageIcons[skill.code];
    return <Icon size='75%' />;
  },
  [SkillType.TECHNICAL]: (skill, isMobile) => {
    const Icon = technicalIcons[skill.icon];
    return <Icon size={isMobile ? '50%' : '65%'} />;
  },
  [SkillType.INTEREST]: (skill, isMobile) =>
    getFormattedIcon(interestIcons[skill.icon], isMobile ? '40%' : '55%', false),
};

type SkillButtonContentProps<K extends SkillType> = { skill: SkillOf[K]; skillType: K };

const SkillButtonContent = <K extends SkillType>({
  skill,
  skillType,
}: SkillButtonContentProps<K>) => {
  const isMobile = useIsMobile();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4%' }}>
      {renderIcon[skillType](skill, isMobile)}
      <Typography
        variant='body2'
        sx={{ paddingTop: '5%', color: 'text.primary', textTransform: 'capitalize' }}
      >
        {skill.name}
        {'level' in skill && (
          <>
            <br />
            {skill.level}
          </>
        )}
      </Typography>
    </Box>
  );
};

export default SkillButtonContent;
