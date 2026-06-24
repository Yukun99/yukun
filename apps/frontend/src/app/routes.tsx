import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('@/pages/home/home'));

const Routes: RouteObject[] = [{ path: '/', element: <Home /> }];

export default Routes;