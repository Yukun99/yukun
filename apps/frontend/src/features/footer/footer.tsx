import useIsMobile from '@/common/hooks/use-is-mobile';
import FooterScrollTopButton from '@/features/footer/buttons/footer-scroll-top-button';
import FooterViewCounter from '@/features/footer/footer-view-counter';
import { getPageElementBgColor } from '@/common/utils/palette';
import Box from '@mui/material/Box';
import useResolvedMode from '@/common/hooks/use-resolved-mode';

const Footer = () => {
  const mode = useResolvedMode();
  const isMobile = useIsMobile();

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: isMobile ? '150px' : '300px',
        marginTop: isMobile ? '150px' : '300px',
        bgcolor: getPageElementBgColor(mode),
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: isMobile ? '12px' : '24px',
      }}
    >
      <FooterViewCounter />
      <FooterScrollTopButton />
    </Box>
  );
};

export default Footer;
