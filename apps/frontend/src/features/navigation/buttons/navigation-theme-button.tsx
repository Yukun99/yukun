import RoundIconButton from '@/common/components/buttons/round-icon-button';
import useResolvedMode, { ResolvedMode } from '@/common/hooks/use-resolved-mode';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import { useColorScheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

export function getThemeLabelKey(mode: ResolvedMode) {
  return mode === 'light' ? 'theme.light' : 'theme.dark';
}

export function getThemeIcon(mode: ResolvedMode) {
  return mode === 'light' ? LightMode : DarkMode;
}

const NavigationThemeButton = () => {
  const { t } = useTranslation();
  const { setMode } = useColorScheme();
  const mode = useResolvedMode();

  return (
    <RoundIconButton
      onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
      icon={getThemeIcon(mode)}
      label={t(getThemeLabelKey(mode))}
    />
  );
};

export default NavigationThemeButton;
