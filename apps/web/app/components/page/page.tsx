import { CurrentUserContext } from '@zero/react-api';
import { type ReactNode, useContext } from 'react';
import { Navigate } from 'react-router';
import { routesList } from '@config';
import { Box, Flex, Loader, Group, Paper, Title } from '@mantine/core';
import { routeAvailable } from '@utils';

interface PageProps {
  routeName: keyof typeof routesList;
  children: ReactNode;
  headerActions?: ReactNode;
  title?: string;
}

export const Page = ({
  children,
  routeName,
  title,
  headerActions,
}: PageProps): ReactNode => {
  const { user, initialLoadComplete } = useContext(CurrentUserContext);
  const routeConfig = routesList[routeName];
  if (!routeConfig) {
    return null;
  }
  const header = routeConfig.header ?? routeName;
  const capitalisedHeader = `${header
    .charAt(0)
    .toLocaleUpperCase()}${header.slice(1)}`;

  if (!initialLoadComplete) {
    return (
      <Flex justify={'center'} align={'center'} pt="xl">
        <Loader />
      </Flex>
    );
  }

  if (!routeAvailable(user, routeConfig, routeName)) {
    return <Navigate to={routeConfig.authFailRedirect} />;
  }

  return initialLoadComplete ? (
    <>
      <Title order={2} size="h1">
        <Group align="start">
          <Box style={{ flexGrow: 2 }}>{title ?? capitalisedHeader}</Box>
          {headerActions}
        </Group>
      </Title>
      <Paper shadow="sm" p="xl" mt="lg" withBorder>
        {children}
      </Paper>
    </>
  ) : null;
};
