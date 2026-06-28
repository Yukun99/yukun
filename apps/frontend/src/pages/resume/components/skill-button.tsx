import Button from '@mui/material/Button';
import { ReactNode } from 'react';
import { BUTTON_SIZE } from '@/common/components/buttons/round-icon-button';
import { getColor, GRAY, OPACITY } from '@/app/palette';
import { isMobileOnly } from 'react-device-detect';
import { GLOBAL_MARGIN, GLOBAL_PADDING } from '@/pages/page';
import {
  getButtonContent,
  getDialogContent,
  Skill,
  SkillType,
} from '@/pages/resume/utils/skill-button-utils';

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
  size = isMobileOnly ? BUTTON_SIZE * 1.5 : BUTTON_SIZE * 2.5,
}: SkillButtonProps) => {
  return (
    <Button
      onClick={() => setSkillDialogContent(getDialogContent[skillType](skill))}
      sx={{
        width: size,
        height: size,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: `${GLOBAL_PADDING}px`,
        margin: `${GLOBAL_MARGIN}px`,
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
      {getButtonContent[skillType](skill)}
    </Button>
  );
};

export default SkillButton;