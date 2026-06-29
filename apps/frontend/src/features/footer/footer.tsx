import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import { getPageElementBgColor } from '@/features/navigation/navigation';
import FooterViewCounter from '@/features/footer/footer-view-counter';
import FooterScrollTopButton from '@/features/footer/buttons/footer-scroll-top-button';

const Footer = () => {
  const { mode } = useColorScheme();

  return (
    <Box
      sx={{
        position: 'relative',
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
      <FooterViewCounter />
      <FooterScrollTopButton />
    </Box>
  );
};

export default Footer;