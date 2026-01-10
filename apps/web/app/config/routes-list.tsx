import { type ReactElement } from 'react';
import {
  IconLogin,
  IconUser,
  IconHome,
  IconLogout,
  IconUsers,
  IconUsersGroup,
  IconPig,
} from '@tabler/icons-react';
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
  accountTransactions: {
    component: 'routes/account-transactions.tsx',
    path: 'accounts/:accountId/transactions',
    authFailRedirect: '/login',
    hideFromMenu: true,
  },
  home: {
    component: 'routes/home.tsx',
    isIndex: true,
    authFailRedirect: '/login',
    sidebarIcon: <IconHome size={16} stroke={1.5} />,
  },
  accounts: {
    component: 'routes/accounts.tsx',
    authFailRedirect: '/',
    sidebarIcon: <IconPig size={16} stroke={1.5} />,
  },
  roles: {
    component: 'routes/roles.tsx',
    authFailRedirect: '/',
    sidebarIcon: <IconUsersGroup size={16} stroke={1.5} />,
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
  users: {
    component: 'routes/users.tsx',
    authFailRedirect: '/login',
    sidebarIcon: <IconUsers size={16} stroke={1.5} />,
  },
  editUser: {
    component: 'routes/edit-user.tsx',
    path: 'users/:userId/edit',
    authFailRedirect: '/login',
    hideFromMenu: true,
  },
  editRole: {
    component: 'routes/edit-role.tsx',
    path: 'roles/:roleId/edit',
    authFailRedirect: '/login',
    hideFromMenu: true,
  },
} as const satisfies Record<string, RouteSpec>;
