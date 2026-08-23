import useMediaQuery from '@mui/material/useMediaQuery';

// phones and tablets, as opposed to a touchscreen laptop, which still reports hover
const useIsMobile = () => useMediaQuery('(hover: none) and (pointer: coarse)');

export default useIsMobile;
