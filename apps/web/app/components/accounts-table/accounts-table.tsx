import { Currency } from '@components';
import { Table, Text } from '@mantine/core';
import type { Account } from '@zero/domain';
import { Link } from 'react-router';

interface AccountsTableProps {
  accounts: Account[];
}

export const AccountsTable = ({ accounts }: AccountsTableProps) => {
  return (
    <Table verticalSpacing={'lg'}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Current Balance</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {accounts.map((account) => (
          <Table.Tr key={`${account.id}-account-row`}>
            <Table.Td>
              <Link viewTransition to={`/accounts/${account.id}/transactions`}>
                {account.name ? account.name : 'No name'}
              </Link>
            </Table.Td>
            <Table.Td>
              {account.description ? account.description : <Text>None</Text>}
            </Table.Td>
            <Table.Td>
              <Currency>{account.balance}</Currency>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
