import { PURPLE } from '@/app/palette';
import { getPathLabel } from '@/app/routes';
import { getFormattedIcon } from '@/common/components/buttons/round-icon-button';
import { FROSTED_BG } from '@/common/components/sections/section';
import { useSpacing } from '@/pages/page';
import { SvgIconComponent } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';

const SIZE = 96;

type NavigationPageButtonProps = { path: string; icon: SvgIconComponent; onNavigate?: () => void };

const NavigationPageButton = ({ path, icon, onNavigate }: NavigationPageButtonProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { padding } = useSpacing();

  return (
    <Button
      onClick={() => {
        navigate(path);
        if (pathname !== path) onNavigate?.();
      }}
      sx={{
        flex: `0 0 ${SIZE}px`,
        height: `${SIZE}px`,
        flexDirection: 'column',
        gap: '6px',
        border: pathname === path ? '2px solid' : '1px solid',
        borderColor: pathname === path ? PURPLE[0] : 'divider',
        borderRadius: `${padding}px`,
        background: FROSTED_BG,
        scrollSnapAlign: 'center',
      }}
    >
      {getFormattedIcon(icon, 44, false, 1)}
      <Typography variant='caption' sx={{ color: 'text.primary', textTransform: 'none' }}>
        {getPathLabel(path)}
      </Typography>
    </Button>
  );
};

export default NavigationPageButton;
