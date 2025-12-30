import { type ReactElement } from 'react';
import { IconLogin, IconUser, IconHome, IconLogout } from '@tabler/icons-react';
import type { IRoute } from '@zero/domain';

export interface RouteSpec {
  isIndex?: boolean;
  path?: string;
  header?: string;
  hideFromMenu?: boolean;
  component: string;
  public?: boolean;
  publicOnly?: boolean;
  authFailRedirect: string;
  sidebarIcon?: ReactElement;
}

export const routesList: Record<Exclude<IRoute, 'all'>, RouteSpec> = {
  home: {
    component: 'routes/home.tsx',
    isIndex: true,
    authFailRedirect: '/login',
    sidebarIcon: <IconHome size={16} stroke={1.5} />,
  },
  register: {
    component: 'routes/register.tsx',
    authFailRedirect: '/',
    sidebarIcon: <IconUser size={16} stroke={1.5} />,
    publicOnly: true,
  },

  logout: {
    component: 'routes/logout.tsx',
    authFailRedirect: '/login',
    sidebarIcon: <IconLogout size={16} stroke={1.5} />,
  },
  login: {
    component: 'routes/login.tsx',
    publicOnly: true,
    authFailRedirect: '/',
    sidebarIcon: <IconLogin size={16} stroke={1.5} />,
    public: true,
  },
} as const satisfies Record<string, RouteSpec>;
