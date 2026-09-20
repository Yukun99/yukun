import rotate from '@/assets/resume/Rotate.gif';
import { getPageElementBgColor } from '@/common/utils/palette';
import Box from '@mui/material/Box';
import useResolvedMode from '@/common/hooks/use-resolved-mode';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

type RotateGateProps = { contained?: boolean };

const RotateGate = ({ contained }: RotateGateProps) => {
  const { t } = useTranslation();
  const mode = useResolvedMode();

  return (
    <Box
      sx={{
        position: contained ? 'absolute' : 'fixed',
        inset: 0,
        zIndex: (theme) => theme.zIndex.modal + 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        padding: '24px',
        backgroundColor: getPageElementBgColor(mode),
      }}
    >
      <Box component='img' src={rotate} alt='' sx={{ width: '160px', maxWidth: '55vw' }} />
      <Typography variant='h6' sx={{ textAlign: 'center', letterSpacing: '0.05em' }}>
        {t('rotate')}
      </Typography>
    </Box>
  );
};

export default RotateGate;
