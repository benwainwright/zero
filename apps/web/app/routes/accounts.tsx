import {
  AccountsTable,
  CreateNewAccountModal,
  Loader,
  Page,
} from '@components';
import { useAccounts } from '@zero/react-api';
import { Button, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { useDisclosure } from '@mantine/hooks';

export const Users = (): ReactNode => {
  const accounts = useAccounts(0, 30);
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <Page
      routeName="accounts"
      headerActions={
        <Button onClick={open} variant="subtle">
          Create Account
        </Button>
      }
    >
      <CreateNewAccountModal opened={opened} close={close} />
      <Loader data={accounts}>
        {(data) => {
          if (data.length === 0) {
            return (
              <Text>
                You haven't created any accounts yet! Click the button above to
                create one
              </Text>
            );
          }

          return <AccountsTable accounts={data} />;
        }}
      </Loader>
    </Page>
  );
};

export default Users;
