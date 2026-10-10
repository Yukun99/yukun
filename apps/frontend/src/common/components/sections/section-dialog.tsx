import { BLUR } from '@/common/components/sections/section';
import useSpacing from '@/common/hooks/use-spacing';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Fade from '@mui/material/Fade';
import type { Theme } from '@mui/material/styles';
import type { SystemStyleObject } from '@mui/system';
import { ReactNode } from 'react';

type SectionDialogProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  paperSx?: SystemStyleObject<Theme>;
};

const SectionDialog = ({ open, onClose, children, paperSx }: SectionDialogProps) => {
  const { padding } = useSpacing();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      transitionDuration={0}
      slotProps={{
        paper: {
          sx: {
            display: 'flex',
            flexDirection: 'column',
            borderRadius: `${padding}px`,
            bgcolor: 'transparent',
            boxShadow: 'none',
            backgroundImage: 'none',
            backdropFilter: BLUR,
            WebkitBackdropFilter: BLUR,
            ...paperSx,
          },
        },
      }}
    >
      {/* the paper's blur renders instantly and only the content fades, so the blur never flickers */}
      <Fade appear in={open} timeout={400}>
        <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          {children}
        </Box>
      </Fade>
    </Dialog>
  );
};

export default SectionDialog;
