import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import NavigationDrawerButton from '@/features/navigation/buttons/navigation-drawer-button';
import { BUTTON_SIZE } from '@/common/components/buttons/round-icon-button';
import { isMobileOnly } from 'react-device-detect';

type NavigationDrawerProps = { isOpen: boolean; onClose: () => void };

const NavigationDrawer = ({ isOpen, onClose }: NavigationDrawerProps) => {
  return (
    <Drawer anchor='left' open={isOpen} onClose={onClose}>
      <Box
        sx={{
          minWidth: '250px',
          maxWidth: '300px',
          height: '100vh',
          paddingTop: `${BUTTON_SIZE + (isMobileOnly ? 12 : 16)}px`,
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