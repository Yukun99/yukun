import { getPageElementBgColor } from '@/common/utils/palette';
import logo from '@/assets/logo.svg';
import RoundIconButton from '@/common/components/buttons/round-icon-button';
import useIsMobile from '@/common/hooks/use-is-mobile';
import NavigationLanguageButton from '@/features/navigation/buttons/navigation-lang-button';
import NavigationMenuButton from '@/features/navigation/buttons/navigation-menu-button';
import NavigationThemeButton from '@/features/navigation/buttons/navigation-theme-button';
import NavigationDrawer from '@/features/navigation/navigation-drawer';
import NavigationMobile from '@/features/navigation/navigation-mobile';
import Box from '@mui/material/Box';
import Portal from '@mui/material/Portal';
import useResolvedMode from '@/common/hooks/use-resolved-mode';
import { useState } from 'react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mode = useResolvedMode();
  const isMobile = useIsMobile();

  if (isMobile) return <NavigationMobile />;

  return (
    <Box
      sx={{
        display: 'flex',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: (theme) => theme.shadows[16],
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        backgroundColor: getPageElementBgColor(mode),
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
