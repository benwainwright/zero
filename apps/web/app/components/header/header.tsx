import { BankConnectionIcon } from '@components';
import { AppShell, Box, Burger, Group } from '@mantine/core';
import { CurrentUserContext } from '@zero/react-api';
import { useContext, type ReactNode } from 'react';

interface HeaderProps {
  title: string;
  sideBarOpened: boolean;
  onBurgerClick: () => void;
}

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
      </Group>
      {user && <BankConnectionIcon />}
    </AppShell.Header>
  );
};
