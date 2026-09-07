import rotate from '@/assets/resume/Rotate.gif';
import { getPageElementBgColor } from '@/features/navigation/navigation';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

type RotateGateProps = { contained?: boolean };

const RotateGate = ({ contained }: RotateGateProps) => {
  const { t } = useTranslation();
  const { mode } = useColorScheme();

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
