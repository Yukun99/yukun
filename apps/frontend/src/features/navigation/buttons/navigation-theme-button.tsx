import RoundIconButton from '@/common/components/buttons/round-icon-button';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import { useColorScheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

type Mode = 'light' | 'dark' | 'system';

function toggleMode(mode: Mode | undefined, setMode: (mode: Mode | null) => void) {
  if (!mode) return setMode('light');
  setMode(mode === 'light' ? 'dark' : 'light');
}

export function getThemeLabelKey(mode: Mode | undefined) {
  return mode === 'light' ? 'theme.light' : 'theme.dark';
}

export function getThemeIcon(mode: Mode | undefined) {
  return mode === 'light' ? LightMode : DarkMode;
}

export function toggleThemeMode(mode: Mode | undefined, setMode: (mode: Mode | null) => void) {
  toggleMode(mode, setMode);
}

const NavigationThemeButton = () => {
  const { t } = useTranslation();
  const { mode, setMode } = useColorScheme();

  return (
    <RoundIconButton
      onClick={() => toggleMode(mode, setMode)}
      icon={getThemeIcon(mode)}
      label={t(getThemeLabelKey(mode))}
    />
  );
};

export default NavigationThemeButton;
