import { BUTTON_SIZE } from '@/common/components/buttons/round-icon-button';
import { FROSTED_BG } from '@/common/components/sections/section';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useSpacing from '@/common/hooks/use-spacing';
import SkillButtonContent from '@/pages/resume/components/skill-button-content';
import { SkillOf, SkillType } from '@/pages/resume/utils/skill-types';
import Button from '@mui/material/Button';

// without onSelect the button is only a tile: no click, ripple, hover or tab stop
type SkillButtonProps<K extends SkillType> = {
  skill: SkillOf[K];
  skillType: K;
  onSelect?: (skill: SkillOf[K]) => void;
  size?: number;
};

const SkillButton = <K extends SkillType>({
  skill,
  skillType,
  onSelect,
  size,
}: SkillButtonProps<K>) => {
  const isMobile = useIsMobile();
  const { margin, padding } = useSpacing();
  const buttonSize = size ?? (isMobile ? BUTTON_SIZE * 1.45 : BUTTON_SIZE * 2.5);

  return (
    <Button
      component={onSelect ? 'button' : 'div'}
      onClick={onSelect ? () => onSelect(skill) : undefined}
      disableRipple={!onSelect}
      tabIndex={onSelect ? 0 : -1}
      sx={{
        width: buttonSize,
        height: buttonSize,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: `${padding}px`,
        margin: `${margin}px`,
        boxShadow: (theme) => theme.shadows[16],
        background: FROSTED_BG,
        ...(onSelect ? {} : { cursor: 'default', '&:hover': { background: FROSTED_BG } }),
      }}
    >
      <SkillButtonContent skill={skill} skillType={skillType} />
    </Button>
  );
};

export default SkillButton;
