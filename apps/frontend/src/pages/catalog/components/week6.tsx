import { BUTTON_SIZE, getFormattedIcon } from '@/common/components/buttons/round-icon-button';
import { FROSTED_BG } from '@/common/components/sections/section';
import useIsMobile from '@/common/hooks/use-is-mobile';
import useSpacing from '@/common/hooks/use-spacing';
import WbSunny from '@mui/icons-material/WbSunny';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const SITE_URL = 'https://weather.yukunxu.com/';

const Week6Example = () => {
  const isMobile = useIsMobile();
  const { margin, padding } = useSpacing();
  const size = isMobile ? BUTTON_SIZE * 1.45 : BUTTON_SIZE * 2.5;

  return (
    <Button
      onClick={() => window.open(SITE_URL, '_blank', 'noopener,noreferrer')}
      sx={{
        width: size,
        height: size,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: `${padding}px`,
        margin: `${margin}px`,
        boxShadow: (theme) => theme.shadows[16],
        background: FROSTED_BG,
      }}
    >
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '4%' }}
      >
        {getFormattedIcon(WbSunny, isMobile ? '40%' : '55%', false)}
        <Typography
          variant='body2'
          sx={{ paddingTop: '5%', color: 'text.primary', textTransform: 'capitalize' }}
        >
          Weather
        </Typography>
      </Box>
    </Button>
  );
};

export default Week6Example;
