import { technicalIcons } from '@/pages/resume/utils/skill-icons';
import { TechnicalSkill } from '@/pages/resume/utils/skill-types';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const ICON_SIZE = 18;

type SkillPillProps = {
  skill: TechnicalSkill;
  onSelect: (skill: TechnicalSkill) => void;
};

const SkillPill = ({ skill, onSelect }: SkillPillProps) => {
  const Icon = technicalIcons[skill.icon];

  return (
    <Button
      onClick={() => onSelect(skill)}
      sx={{
        minWidth: 0,
        padding: '0 8px',
        gap: '6px',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '999px',
      }}
    >
      {Icon && <Icon size={ICON_SIZE} />}
      <Typography variant='button' sx={{ color: 'text.primary', textTransform: 'none' }}>
        {skill.name}
      </Typography>
    </Button>
  );
};

export default SkillPill;
