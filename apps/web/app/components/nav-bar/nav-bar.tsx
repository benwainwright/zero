import { AppShell, Button, NavLink } from '@mantine/core';
import { routesList } from '@config';
import { useContext, type ReactNode } from 'react';
import { IconBug } from '@tabler/icons-react';
import { CurrentUserContext } from '@zero/react-api';
import { Link, useLocation } from 'react-router';
import type { IRoute } from '@zero/domain';
import { routeAvailable } from '@utils';
import { DebugDrawer } from '@components';
import { useDisclosure } from '@mantine/hooks';

export const NavBar = (): ReactNode => {
  const location = useLocation();
  const { pathname } = location;
  const list = routesList;
  const [opened, { open, close }] = useDisclosure(false);
  const { user } = useContext(CurrentUserContext);

  const notProd = process.env['NODE_ENV'] !== 'production';

  const debugDrawer = notProd ? (
    <DebugDrawer opened={opened} onClose={close} />
  ) : null;

  const debugDrawerButton = notProd ? (
    <NavLink
      component={Link}
      label="Debug"
      onClick={open}
      to="#debug"
      leftSection={<IconBug size={16} stroke={1.5} />}
    />
  ) : null;

  return (
    <AppShell.Navbar>
      {debugDrawer}
      <nav>
        {debugDrawerButton}
        {Object.entries(list)
          .slice()
          .sort(([, a], [, b]) =>
            (a.sidebarPosition ?? 0) > (b.sidebarPosition ?? 0) ? 1 : -1
          )
          .filter(
            ([key, value]) =>
              routeAvailable(user, value, key as IRoute) && !value.hideFromMenu
          )
          .map(([key, value]) => {
            const toString = value.isIndex ? '' : key;
            return (
              <NavLink
                viewTransition
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
      </nav>
    </AppShell.Navbar>
  );
};
