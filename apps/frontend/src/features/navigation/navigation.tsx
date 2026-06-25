import { useState } from 'react';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import NavigationMenuButton from '@/features/navigation/buttons/navigation-menu-button';
import NavigationThemeButton from '@/features/navigation/buttons/navigation-theme-button';
import NavigationLanguageButton from '@/features/navigation/buttons/navigation-lang-button';
import NavigationDrawer from '@/features/navigation/navigation-drawer';
import logo from '@/assets/logo.svg';
import RoundIconButton from '@/common/components/buttons/round-icon-button';
import { getColor, GRAY, OPACITY } from '@/app/palette';
import { useColorScheme } from '@mui/material/styles';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { mode } = useColorScheme();

  return (
    <Box
      sx={{
        display: 'flex',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: (theme) => theme.shadows[16],
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor:
          mode === 'dark' ? getColor(GRAY[80], OPACITY[100]) : getColor(GRAY[20], OPACITY[100]),
      }}
    >
      <Portal>
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            display: 'flex',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <NavigationMenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          <RoundIconButton icon={logo} isSpecial />
        </Box>
      </Portal>
      <Box sx={{ marginLeft: 'auto' }}>
        <NavigationLanguageButton />
        <NavigationThemeButton />
      </Box>
      <NavigationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Box>
  );
};

export default Navigation;