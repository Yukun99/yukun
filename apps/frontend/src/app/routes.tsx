import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

export const PATH_LABELS: Record<string, string> = { '/': 'Home' };

const Home = lazy(() => import('@/pages/home/home'));

const Routes: RouteObject[] = [{ path: '/', element: <Home /> }];

export default Routes;