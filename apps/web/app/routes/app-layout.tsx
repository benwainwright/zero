import { Header, NavBar, Notifications } from '@components';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Container } from '@mantine/core';
import { Outlet } from 'react-router';
import type { ReactNode } from 'react';
import {
  CurrentUserProvider,
  HttpRequestsProvider,
  useLogErrors,
} from '@zero/react-api';
import { useEventNotifications } from '@context';

const AppLayout = (): ReactNode => {
  const [opened, { toggle }] = useDisclosure();
  useLogErrors();
  useEventNotifications();
  return (
    <CurrentUserProvider>
      <HttpRequestsProvider>
        <AppShell
          transitionDuration={500}
          transitionTimingFunction="ease"
          padding="md"
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: 'sm',
            collapsed: { mobile: !opened },
          }}
        >
          <Header title="Zero" onBurgerClick={toggle} sideBarOpened={opened} />
          <NavBar />

          <AppShell.Main>
            <Container>
              <Notifications />
              <Outlet />
            </Container>
          </AppShell.Main>
        </AppShell>
      </HttpRequestsProvider>
    </CurrentUserProvider>
  );
};

export default AppLayout;
