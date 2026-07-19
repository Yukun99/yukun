import { BUTTON_SIZE } from '@/common/components/buttons/round-icon-button';
import { FROSTED_BG } from '@/common/components/sections/section';
import useIsMobile from '@/common/hooks/use-is-mobile';
import { useSpacing } from '@/pages/page';
import { PAGE } from '@/pages/resume/resume';
import {
  DialogContentRenderer,
  getButtonContent,
  getDialogContent,
  SkillOf,
  SkillType,
} from '@/pages/resume/utils/skill-button-utils';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';

type SkillButtonProps<K extends SkillType> = {
  onSelect: (renderer: DialogContentRenderer) => void;
  skill: SkillOf[K];
  skillType: K;
  size?: number;
};

const SkillButton = <K extends SkillType>({
  onSelect,
  skill,
  skillType,
  size,
}: SkillButtonProps<K>) => {
  const isMobile = useIsMobile();
  const { t } = useTranslation(PAGE);
  const { margin, padding } = useSpacing();
  const buttonSize = size ?? (isMobile ? BUTTON_SIZE * 1.45 : BUTTON_SIZE * 2.5);

  return (
    <Button
      onClick={() => onSelect((mobile) => getDialogContent[skillType](skill, mobile, t))}
      sx={{
        width: buttonSize,
        height: buttonSize,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: `${padding}px`,
        margin: `${margin}px`,
        boxShadow: (theme) => theme.shadows[16],
        background: { FROSTED_BG },
      }}
    >
      {getButtonContent[skillType](skill, isMobile)}
    </Button>
  );
};

export default SkillButton;