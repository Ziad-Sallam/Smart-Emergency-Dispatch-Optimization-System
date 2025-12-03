import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Login from './pages/Login';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
  requiresAuth?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
    requiresAuth: false,
  },
  {
    name: 'Dashboard',
    path: '/',
    element: <Dashboard />,
    requiresAuth: false,
  },
  {
    name: 'Analytics',
    path: '/analytics',
    element: <Analytics />,
    requiresAuth: false,
  },
];

export default routes;
