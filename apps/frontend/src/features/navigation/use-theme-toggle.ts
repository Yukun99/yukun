import useResolvedMode from '@/common/hooks/use-resolved-mode';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import { useColorScheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const useThemeToggle = () => {
  const { t } = useTranslation();
  const { setMode } = useColorScheme();
  const mode = useResolvedMode();
  const isLight = mode === 'light';

  return {
    icon: isLight ? LightMode : DarkMode,
    label: t(isLight ? 'theme.light' : 'theme.dark'),
    toggle: () => setMode(isLight ? 'dark' : 'light'),
  };
};

export default useThemeToggle;
