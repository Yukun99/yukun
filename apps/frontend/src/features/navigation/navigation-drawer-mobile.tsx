import logo from '@/assets/logo.svg';
import RoundIconButton from '@/common/components/buttons/round-icon-button';
import NavigationActionButton from '@/features/navigation/buttons/navigation-action-button';
import NavigationPageButton from '@/features/navigation/buttons/navigation-page-button';
import {
  getThemeIcon,
  getThemeLabelKey,
} from '@/features/navigation/buttons/navigation-theme-button';
import { getPageElementBgColor } from '@/features/navigation/navigation';
import { useSpacing } from '@/pages/page';
import Close from '@mui/icons-material/Close';
import Description from '@mui/icons-material/Description';
import Home from '@mui/icons-material/Home';
import Public from '@mui/icons-material/Public';
import Widgets from '@mui/icons-material/Widgets';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { useColorScheme } from '@mui/material/styles';
import type { TransitionProps } from '@mui/material/transitions';
import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

const PAGES = [
  { path: '/', icon: Home },
  { path: '/resume', icon: Description },
  { path: '/catalog', icon: Widgets },
];

function getLanguageLabel(language: string) {
  return language.startsWith('zh') ? '中文' : 'English';
}

// contained keeps the drawer inside its own section instead of the whole screen, for the catalog
type MobileNavigationDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  contained?: boolean;
  containerRef?: RefObject<HTMLElement | null>;
};

const NavigationDrawerMobile = ({
  isOpen,
  onClose,
  contained,
  containerRef,
}: MobileNavigationDrawerProps) => {
  const { t, i18n } = useTranslation();
  const { mode, setMode } = useColorScheme();
  const { margin, padding } = useSpacing();

  return (
    <Drawer
      anchor='bottom'
      open={isOpen}
      onClose={onClose}
      sx={contained ? { position: 'absolute' } : undefined}
      ModalProps={contained ? { disablePortal: true } : undefined}
      slotProps={{
        backdrop: contained ? { sx: { position: 'absolute' } } : undefined,
        // slide measures its travel against the window unless it is told what it slides out of
        transition: contained
          ? ({ container: () => containerRef?.current } as TransitionProps)
          : undefined,
        paper: {
          sx: {
            position: contained ? 'absolute' : undefined,
            borderTopLeftRadius: `${padding}px`,
            borderTopRightRadius: `${padding}px`,
            backgroundColor: getPageElementBgColor(mode),
            backgroundImage: 'none',
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: `${margin}px`,
          padding: `${margin}px`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: `${margin}px` }}>
          <NavigationActionButton icon={logo} label={t('common.givenName')} isSpecial />
          <NavigationActionButton
            icon={Public}
            label={getLanguageLabel(i18n.language)}
            onClick={() => i18n.changeLanguage(i18n.language.startsWith('zh') ? 'en' : 'zh')}
          />
          <NavigationActionButton
            icon={getThemeIcon(mode)}
            label={t(getThemeLabelKey(mode))}
            onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          />
          <Box sx={{ marginLeft: 'auto' }}>
            <RoundIconButton icon={Close} onClick={onClose} size={40} iconScale={0.62} />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            gap: `${margin}px`,
            overflowX: 'auto',
            scrollSnapType: 'x proximity',
            paddingBottom: '4px',
          }}
        >
          {PAGES.map((page) => (
            <NavigationPageButton
              key={page.path}
              path={page.path}
              icon={page.icon}
              onNavigate={onClose}
            />
          ))}
        </Box>
      </Box>
    </Drawer>
  );
};

export default NavigationDrawerMobile;
