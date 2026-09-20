import useSpacing from '@/common/hooks/use-spacing';
import SkillDialogContent from '@/pages/resume/components/skill-dialog-content';
import { TechnicalSkill } from '@/pages/resume/utils/skill-types';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Fade from '@mui/material/Fade';

type SkillDialogProps = { skill: TechnicalSkill | null; onClose: () => void };

const SkillDialog = ({ skill, onClose }: SkillDialogProps) => {
  const { padding } = useSpacing();

  return (
    <Dialog
      open={Boolean(skill)}
      onClose={onClose}
      transitionDuration={0}
      slotProps={{
        paper: {
          sx: {
            borderRadius: `${padding}px`,
            bgcolor: 'transparent',
            boxShadow: 'none',
            backgroundImage: 'none',
            backdropFilter: 'blur(20px) saturate(250%)',
            WebkitBackdropFilter: 'blur(20px) saturate(250%)',
          },
        },
      }}
    >
      <Fade appear in={Boolean(skill)} timeout={400}>
        <Box>{skill && <SkillDialogContent skill={skill} />}</Box>
      </Fade>
    </Dialog>
  );
};

export default SkillDialog;
