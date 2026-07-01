import { useSpacing } from '@/pages/page';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Fade from '@mui/material/Fade';
import { ReactNode } from 'react';

type SkillDialogProps = {
  content?: ReactNode;
  setSkillDialogContent: (content?: ReactNode) => void;
};

const SkillDialog = ({ content, setSkillDialogContent }: SkillDialogProps) => {
  const { padding } = useSpacing();

  return (
    <Dialog
      open={Boolean(content)}
      onClose={() => setSkillDialogContent(undefined)}
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
      <Fade appear in={Boolean(content)} timeout={400}>
        <Box>{content}</Box>
      </Fade>
    </Dialog>
  );
};

export default SkillDialog;
