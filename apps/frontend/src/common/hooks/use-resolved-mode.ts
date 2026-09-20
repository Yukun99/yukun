import { useColorScheme } from '@mui/material/styles';

export type ResolvedMode = 'light' | 'dark';

// mode is 'system' until the reader picks one, so the real scheme has to come from systemMode
const useResolvedMode = (): ResolvedMode => {
  const { mode, systemMode } = useColorScheme();
  return (mode === 'system' ? systemMode : mode) ?? 'light';
};

export default useResolvedMode;
