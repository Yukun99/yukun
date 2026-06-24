import { useState } from 'react';
import Box from '@mui/material/Box';
import NavigationMenuButton from '@/features/navigation/buttons/navigation-menu-button';
import NavigationThemeButton from '@/features/navigation/buttons/navigation-theme-button';
import NavigationLanguageButton from '@/features/navigation/buttons/navigation-lang-button';
import NavigationDrawer from '@/features/navigation/navigation-drawer';
import logo from '@/assets/logo.svg';
import RoundIconButton from '@/common/components/buttons/round-icon-button';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      sx={{
        display: 'flex',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: (theme) => theme.shadows[16],
        marginBottom: '16px',
      }}
    >
      <Box sx={{ marginRight: 'auto' }}>
        <NavigationMenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
        <RoundIconButton icon={logo} isSpecial />
      </Box>
      <Box sx={{ marginLeft: 'auto' }}>
        <NavigationLanguageButton />
        <NavigationThemeButton />
      </Box>
      <NavigationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Box>
  );
};

export default Navigation;