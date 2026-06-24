import { useState } from 'react';
import Box from '@mui/material/Box';
import NavigationMenuButton from '@/features/navigation/buttons/navigation-menu-button';
import NavigationThemeButton from '@/features/navigation/buttons/navigation-theme-button';
import NavigationLanguageButton from '@/features/navigation/buttons/navigation-lang-button';
import NavigationDrawer from '@/features/navigation/navigation-drawer';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', borderBottom: '1px solid', borderColor: 'divider' }}>
      <NavigationMenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
      <NavigationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <Box sx={{ marginLeft: 'auto' }}>
        <NavigationLanguageButton />
        <NavigationThemeButton />
      </Box>
    </Box>
  );
};

export default Navigation;