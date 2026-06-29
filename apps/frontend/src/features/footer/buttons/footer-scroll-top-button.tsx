import Button from '@mui/material/Button';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useScrollToTop } from '@/app/scroll-context';

const FooterScrollTopButton = () => {
  const scrollToTop = useScrollToTop();

  return (
    <Button onClick={scrollToTop} sx={{ position: 'absolute', top: '16px', right: '16px' }}>
      <KeyboardArrowUpIcon fontSize='large' />
    </Button>
  );
};

export default FooterScrollTopButton;