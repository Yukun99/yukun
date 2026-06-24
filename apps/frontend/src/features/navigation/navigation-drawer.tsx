import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';

type NavigationDrawerProps = { isOpen: boolean; onClose: () => void };

const NavigationDrawer = ({ isOpen, onClose }: NavigationDrawerProps) => {
  return (
    <Drawer anchor='left' open={isOpen} onClose={onClose}>
      <Box sx={{ width: '300px', height: '100vh' }}></Box>
    </Drawer>
  );
};

export default NavigationDrawer;