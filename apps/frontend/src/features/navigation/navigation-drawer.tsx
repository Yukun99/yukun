import { BUTTON_SIZE } from '@/common/components/buttons/round-icon-button';
import useIsMobile from '@/common/hooks/use-is-mobile';
import NavigationDrawerButton from '@/features/navigation/buttons/navigation-drawer-button';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

type NavigationDrawerProps = { isOpen: boolean; onClose: () => void };

const NavigationDrawer = ({ isOpen, onClose }: NavigationDrawerProps) => {
  const isMobile = useIsMobile();

  return (
    <Drawer anchor='left' open={isOpen} onClose={onClose}>
      <Box
        sx={{
          minWidth: '250px',
          maxWidth: '300px',
          height: '100vh',
          paddingTop: `${BUTTON_SIZE + (isMobile ? 12 : 16)}px`,
        }}
      >
        <NavigationDrawerButton path={'/'} />
        <NavigationDrawerButton path={'/resume'} />
        <NavigationDrawerButton path={'/catalog'} />
      </Box>
    </Drawer>
  );
};

export default NavigationDrawer;
