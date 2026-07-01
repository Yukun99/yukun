import { getColor, GRAY, OPACITY } from '@/app/palette';
import { BUTTON_SIZE } from '@/common/components/buttons/round-icon-button';
import useIsMobile from '@/common/hooks/use-is-mobile';
import { useSpacing } from '@/pages/page';
import {
  getButtonContent,
  getDialogContent,
  SkillOf,
  SkillType,
} from '@/pages/resume/utils/skill-button-utils';
import Button from '@mui/material/Button';
import { ReactNode } from 'react';

type SkillButtonProps<K extends SkillType> = {
  setSkillDialogContent: (children?: ReactNode) => void;
  skill: SkillOf[K];
  skillType: K;
  size?: number;
};

const SkillButton = <K extends SkillType>({
  setSkillDialogContent,
  skill,
  skillType,
  size,
}: SkillButtonProps<K>) => {
  const isMobile = useIsMobile();
  const { margin, padding } = useSpacing();
  const buttonSize = size ?? (isMobile ? BUTTON_SIZE * 1.45 : BUTTON_SIZE * 2.5);

  return (
    <Button
      onClick={() => setSkillDialogContent(getDialogContent[skillType](skill, isMobile))}
      sx={{
        width: buttonSize,
        height: buttonSize,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: `${padding}px`,
        margin: `${margin}px`,
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
      {getButtonContent[skillType](skill, isMobile)}
    </Button>
  );
};

export default SkillButton;
