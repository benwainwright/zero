import { Header, NavBar } from '@components';
import { useDisclosure } from '@mantine/hooks';
import { AppShell, Container } from '@mantine/core';
import { Outlet } from 'react-router';
import { useNotifications } from '@data';
import type { ReactNode } from 'react';
import { CurrentUserProvider, useLogErrors } from '@zero/react-api';

const AppLayout = (): ReactNode => {
  const [opened, { toggle }] = useDisclosure();
  useNotifications();
  useLogErrors();
  return (
    <CurrentUserProvider>
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
            <Outlet />
          </Container>
        </AppShell.Main>
      </AppShell>
    </CurrentUserProvider>
  );
};

export default AppLayout;
