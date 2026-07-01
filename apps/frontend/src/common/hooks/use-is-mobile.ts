import type { Theme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const useIsMobile = () => useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));

export default useIsMobile;
