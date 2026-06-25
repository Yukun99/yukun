import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import i18n from 'i18next';

export function getPathLabel(path: string): string {
  return i18n.t(`routeNames.${path}`);
}

const Home = lazy(() => import('@/pages/home/home'));

const Routes: RouteObject[] = [{ path: '/', element: <Home /> }];

export default Routes;