import Dialog from '@mui/material/Dialog';
import { ReactNode } from 'react';

type SkillDialogProps = {
  content?: ReactNode;
  setSkillDialogContent: (content?: ReactNode) => void;
};

const SkillDialog = ({ content, setSkillDialogContent }: SkillDialogProps) => {
  return (
    <Dialog open={Boolean(content)} onClose={() => setSkillDialogContent(undefined)}>
      {content}
    </Dialog>
  );
};

export default SkillDialog;