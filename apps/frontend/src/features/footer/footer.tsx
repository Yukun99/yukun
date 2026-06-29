import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useColorScheme } from '@mui/material/styles';
import { getPageElementBgColor } from '@/features/navigation/navigation';

const ABACUS_NAMESPACE = 'yukunxu-portfolio';
const ABACUS_KEY = 'site-views';

function isLocalhost() {
  const host = window.location.hostname;
  return host === 'localhost' || host === '127.0.0.1' || host === '[::1]';
}

const Footer = () => {
  const { mode } = useColorScheme();
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const endpoint = isLocalhost() ? 'get' : 'hit';
    fetch(`https://abacus.jasoncameron.dev/${endpoint}/${ABACUS_NAMESPACE}/${ABACUS_KEY}`)
      .then((res) => res.json())
      .then((data) => setViews(data.value))
      .catch(() => setViews(null));
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '300px',
        marginTop: '300px',
        bgcolor: getPageElementBgColor(mode),
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      {views !== null && (
        <Typography variant='body2' color='text.secondary'>
          {views.toLocaleString()} views
        </Typography>
      )}
    </Box>
  );
};

export default Footer;