import logo from '@/assets/logo.svg';
import RoundIconButton from '@/common/components/buttons/round-icon-button';
import useResolvedMode from '@/common/hooks/use-resolved-mode';
import NavigationActionButton from '@/features/navigation/buttons/navigation-action-button';
import NavigationPageButton from '@/features/navigation/buttons/navigation-page-button';
import { PAGES } from '@/features/navigation/pages';
import useLanguageToggle from '@/features/navigation/use-language-toggle';
import useThemeToggle from '@/features/navigation/use-theme-toggle';
import { getPageElementBgColor } from '@/common/utils/palette';
import useSpacing from '@/common/hooks/use-spacing';
import Close from '@mui/icons-material/Close';
import Public from '@mui/icons-material/Public';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import type { TransitionProps } from '@mui/material/transitions';
import type { RefObject } from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const mode = useResolvedMode();
  const language = useLanguageToggle();
  const theme = useThemeToggle();
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
            label={language.label}
            onClick={language.toggle}
          />
          <NavigationActionButton
            icon={theme.icon}
            label={theme.label}
            onClick={theme.toggle}
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
