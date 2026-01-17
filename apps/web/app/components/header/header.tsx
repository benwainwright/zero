import { BankConnectionIcon } from '@components';
import { AppShell, Box, Burger, Group } from '@mantine/core';
import { CurrentUserContext, useBankConnection } from '@zero/react-api';
import { IconHttpGet, IconCalendar } from '@tabler/icons-react';
import { useContext, type ReactNode } from 'react';
import { Link } from 'react-router';

interface HeaderProps {
  title: string;
  sideBarOpened: boolean;
  onBurgerClick: () => void;
}

const notProd = process.env['NODE_ENV'] !== 'production';

export const Header = ({
  title,
  sideBarOpened,
  onBurgerClick,
}: HeaderProps): ReactNode => {
  const { user } = useContext(CurrentUserContext);
  return (
    <AppShell.Header>
      <Group h="100%" px="md">
        <Box style={{ flexGrow: 2 }}>
          <Burger
            opened={sideBarOpened}
            onClick={onBurgerClick}
            hiddenFrom="sm"
            size="sm"
          />
          {title}
        </Box>
        {notProd && (
          <>
            <Link to="event-log">
              <IconCalendar />
            </Link>
            <Link to="http-requests">
              <IconHttpGet />
            </Link>
          </>
        )}
        {user && <BankConnectionIcon />}
      </Group>
    </AppShell.Header>
  );
};
