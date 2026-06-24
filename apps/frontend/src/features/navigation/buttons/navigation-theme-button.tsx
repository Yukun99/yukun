import RoundIconButton from '@/common/components/buttons/round-icon-button';
import { useColorScheme } from '@mui/material/styles';
import { DarkMode, LightMode } from '@mui/icons-material';

type Mode = 'light' | 'dark' | 'system';

function getThemeLabel(mode: Mode | undefined) {
  if (!mode) return 'light';
  return mode === 'light' ? 'Light' : 'Dark';
}

function toggleMode(mode: Mode | undefined, setMode: (mode: Mode | null) => void) {
  if (!mode) return setMode('light');
  setMode(mode === 'light' ? 'dark' : 'light');
}

const NavigationThemeButton = () => {
  const { mode, setMode } = useColorScheme();

  const icon = mode === 'light' ? LightMode : DarkMode;
  return (
    <RoundIconButton
      onClick={() => toggleMode(mode, setMode)}
      icon={icon}
      label={getThemeLabel(mode)}
    />
  );
};

export default NavigationThemeButton;