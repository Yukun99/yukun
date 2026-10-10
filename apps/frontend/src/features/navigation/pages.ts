import Description from '@mui/icons-material/Description';
import Home from '@mui/icons-material/Home';
import Lightbulb from '@mui/icons-material/Lightbulb';
import Widgets from '@mui/icons-material/Widgets';

export const PAGES = [
  { path: '/', icon: Home },
  { path: '/resume', icon: Description },
  { path: '/catalog', icon: Widgets },
  { path: '/ideas', icon: Lightbulb },
] as const;

export type PagePath = (typeof PAGES)[number]['path'];
