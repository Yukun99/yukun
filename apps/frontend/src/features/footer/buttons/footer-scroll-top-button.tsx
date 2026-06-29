import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { useScrollToTop } from '@/app/scroll-context';
import RoundIconButton from '@/common/components/buttons/round-icon-button';

const FooterScrollTopButton = () => {
  const scrollToTop = useScrollToTop();

  return (
    <RoundIconButton
      icon={KeyboardArrowUpIcon}
      onClick={scrollToTop}
      style={{ position: 'absolute', top: '16px', right: '16px' }}
    />
  );
};

export default FooterScrollTopButton;