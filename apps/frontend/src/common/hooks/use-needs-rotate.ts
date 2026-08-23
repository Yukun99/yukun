import useIsMobile from '@/common/hooks/use-is-mobile';
import useMediaQuery from '@mui/material/useMediaQuery';

// mobile devices only get the app in landscape, since the timeline needs the width
const useNeedsRotate = () => {
  const isMobile = useIsMobile();
  const isPortrait = useMediaQuery('(orientation: portrait)');

  return isMobile && isPortrait;
};

export default useNeedsRotate;
