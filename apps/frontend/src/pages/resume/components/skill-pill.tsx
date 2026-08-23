import { PAGE } from '@/pages/resume/resume';
import {
  DialogContentRenderer,
  getDialogContent,
  SkillType,
  technicalNameIconMap,
  TechnicalSkill,
} from '@/pages/resume/utils/skill-button-utils';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

const ICON_SIZE = 18;

type SkillPillProps = {
  skill: TechnicalSkill;
  onSelect: (renderer: DialogContentRenderer) => void;
};

const SkillPill = ({ skill, onSelect }: SkillPillProps) => {
  const { t } = useTranslation(PAGE);
  const Icon = technicalNameIconMap[skill.icon];

  return (
    <Button
      onClick={() => onSelect((mobile) => getDialogContent[SkillType.TECHNICAL](skill, mobile, t))}
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
