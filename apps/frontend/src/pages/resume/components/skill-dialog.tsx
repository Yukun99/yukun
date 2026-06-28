import Dialog from '@mui/material/Dialog';
import { ReactNode } from 'react';
import { GLOBAL_PADDING } from '@/pages/page';

type SkillDialogProps = {
  content?: ReactNode;
  setSkillDialogContent: (content?: ReactNode) => void;
};

const SkillDialog = ({ content, setSkillDialogContent }: SkillDialogProps) => {
  return (
    <Dialog
      open={Boolean(content)}
      onClose={() => setSkillDialogContent(undefined)}
      slotProps={{
        paper: { sx: { padding: `${GLOBAL_PADDING}px`, borderRadius: `${GLOBAL_PADDING}px` } },
      }}
    >
      {content}
    </Dialog>
  );
};

export default SkillDialog;