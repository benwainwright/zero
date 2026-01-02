import { AppShell, NavLink } from '@mantine/core';
import { routesList } from '@config';
import { useContext, type ReactNode } from 'react';
import { CurrentUserContext } from '@zero/react-api';
import { Link, useLocation } from 'react-router';
import type { IRoute } from '@zero/domain';
import { routeAvailable } from '@utils';

export const NavBar = (): ReactNode => {
  const location = useLocation();
  const { pathname } = location;
  const list = routesList;
  const { user } = useContext(CurrentUserContext);
  return (
    <AppShell.Navbar>
      <ul>
        {Object.entries(list)
          .filter(
            ([key, value]) =>
              routeAvailable(user, value, key as IRoute) && !value.hideFromMenu
          )
          .map(([key, value]) => {
            const toString = value.isIndex ? '' : key;
            return (
              <NavLink
                key={`nav-bar-${key}`}
                active={
                  (toString.length === 0 && pathname === '/') ||
                  (toString.length > 0 && pathname.endsWith(toString))
                }
                component={Link}
                to={toString}
                label={`${key.charAt(0).toLocaleUpperCase()}${key.slice(1)}`}
                leftSection={value.sidebarIcon ? value.sidebarIcon : undefined}
              />
            );
          })}
      </ul>
    </AppShell.Navbar>
  );
};
