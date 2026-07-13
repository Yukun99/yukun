import i18n from 'i18next';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

export function getPathLabel(path: string): string {
  return i18n.t(`routeNames.${path}`);
}

const Home = lazy(() => import('@/pages/home/home'));
const Resume = lazy(() => import('@/pages/resume/resume'));
const Catalog = lazy(() => import('@/pages/catalog/catalog'));

const Routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/resume', element: <Resume /> },
  { path: '/catalog', element: <Catalog /> },
];

export default Routes;