import { PagePath, PAGES } from '@/features/navigation/pages';
import { lazy, ReactNode } from 'react';
import { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('@/pages/home/home'));
const Resume = lazy(() => import('@/pages/resume/resume'));
const Catalog = lazy(() => import('@/pages/catalog/catalog'));

const ELEMENTS: Record<PagePath, ReactNode> = {
  '/': <Home />,
  '/resume': <Resume />,
  '/catalog': <Catalog />,
};

const Routes: RouteObject[] = PAGES.map(({ path }) => ({ path, element: ELEMENTS[path] }));

export default Routes;
