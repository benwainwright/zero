import { Table } from '@mantine/core';
import type { User } from '@zero/domain';
import { Link } from 'react-router';

interface UsersTableProps {
  users: User[];
}

export const UsersTable = ({ users }: UsersTableProps) => {
  return (
    <Table verticalSpacing={'sm'}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Username</Table.Th>
          <Table.Th>Email</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {users.map((user) => (
          <Table.Tr key={`${user.id}-user-row`}>
            <Table.Td>
              <Link viewTransition to={`/users/${user.id}/edit`}>
                {user.id}
              </Link>
            </Table.Td>
            <Table.Td>{user.email}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
