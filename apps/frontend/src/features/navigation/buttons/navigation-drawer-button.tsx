import { getPathLabel } from '@/app/routes';
import { ChevronRight } from '@mui/icons-material';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';

type NavigationDrawerButtonProps = { path: string };

const NavigationDrawerButton = ({ path }: NavigationDrawerButtonProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const label = getPathLabel(path);

  return (
    <ToggleButton
      value={path}
      selected={pathname === path}
      onClick={() => navigate(path)}
      sx={{
        borderRadius: 0,
        width: '100%',
        textTransform: 'none',
        justifyContent: 'flex-start',
        display: 'flex',
        flexDirection: 'row',
        paddingY: '10px',
        paddingRight: '6px',
      }}
    >
      <Typography variant='h5' sx={{ fontWeight: '500', letterSpacing: '0.05em' }}>
        {label}
      </Typography>
      <Box
        sx={{
          marginLeft: 'auto',
          borderLeft: '1px solid',
          borderColor: 'divider',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          paddingY: '6px',
          paddingLeft: '6px',
        }}
      >
        <ChevronRight />
      </Box>
    </ToggleButton>
  );
};

export default NavigationDrawerButton;
