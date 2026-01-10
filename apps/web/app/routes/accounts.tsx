import { CreateNewAccountModal, Loader, Page } from '@components';
import { useAccounts } from '@zero/react-api';
import { Button, Table } from '@mantine/core';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
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
        {(data) => (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Description</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((account) => (
                <Table.Tr key={`${account.id}-account-row`}>
                  <Table.Td>
                    <Link to={`/accounts/${account.id}/transactions`}>
                      {account.name ? account.name : 'No name'}
                    </Link>
                  </Table.Td>
                  <Table.Td>{account.description}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Loader>
    </Page>
  );
};

export default Users;
