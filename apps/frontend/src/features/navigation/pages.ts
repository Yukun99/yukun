import Description from '@mui/icons-material/Description';
import Home from '@mui/icons-material/Home';
import Widgets from '@mui/icons-material/Widgets';

export const PAGES = [
  { path: '/', icon: Home },
  { path: '/resume', icon: Description },
  { path: '/catalog', icon: Widgets },
] as const;

export type PagePath = (typeof PAGES)[number]['path'];
