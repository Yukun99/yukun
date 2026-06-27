import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ReactNode } from 'react';
import ReactCountryFlag from 'react-country-flag';
import { BUTTON_SIZE } from '@/common/components/buttons/round-icon-button';
import { getColor, GRAY, OPACITY } from '@/app/palette';
import { isMobileOnly } from 'react-device-detect';
import { GLOBAL_MARGIN } from '@/pages/page';
import { GLOBAL_PADDING } from '@/pages/page';

export type Skill = { name: string } & Language & Technical;

export enum SkillType {
  LANGUAGE,
  TECHNICAL,
  INTEREST,
}

type Language = { level?: string };

type Technical = { duration?: string; confidence?: string; icon?: string };

function getSkillDialogContent(skill: Skill, skillType: SkillType): ReactNode {
  switch (skillType) {
    default:
      return null;
  }
}

function getButtonContent(skill: Skill, skillType: SkillType): ReactNode {
  switch (skillType) {
    case SkillType.LANGUAGE:
      return getLanguageButtonContent(skill.name, skill.level!);
    default:
      return null;
  }
}

function getLanguageButtonContent(language: string, level: string): ReactNode {
  const countryCodeMap: Record<string, string> = { English: 'GB', Chinese: 'CN' };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4%' }}>
      <ReactCountryFlag
        countryCode={countryCodeMap[language]}
        svg
        style={{ width: '75%', height: 'auto', objectFit: 'contain' }}
      />
      <Typography
        variant='body2'
        sx={{ paddingTop: '5%', color: 'text.primary', textTransform: 'capitalize' }}
      >
        {language}
        {<br />}
        {level}
      </Typography>
    </Box>
  );
}

type SkillButtonProps = {
  setSkillDialogContent: (children?: ReactNode) => void;
  skill: Skill;
  skillType: SkillType;
  size?: number;
};

const SkillButton = ({
  setSkillDialogContent,
  skill,
  skillType,
  size = isMobileOnly ? BUTTON_SIZE * 1.5 : BUTTON_SIZE * 2.25,
}: SkillButtonProps) => {
  return (
    <Button
      onClick={() => setSkillDialogContent(getSkillDialogContent(skill, skillType))}
      sx={{
        width: size,
        height: size,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: `${GLOBAL_PADDING}px`,
        marginX: `${GLOBAL_MARGIN}px`,
        boxShadow: (theme) => theme.shadows[16],
        background: `
          linear-gradient(
            135deg,
            ${getColor(GRAY[30], OPACITY[20])},
            ${getColor(GRAY[70], OPACITY[10])}
          ) padding-box,
          linear-gradient(
            135deg,
            ${getColor(GRAY[30], OPACITY[20])},
            ${getColor(GRAY[70], OPACITY[10])}
          ) border-box
        `,
      }}
    >
      {getButtonContent(skill, skillType)}
    </Button>
  );
};

export default SkillButton;