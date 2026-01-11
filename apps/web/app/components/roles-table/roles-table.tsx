import { Table } from '@mantine/core';
import type { Role } from '@zero/domain';
import { Link } from 'react-router';

interface RolesTableProps {
  roles: Role[];
}

export const RolesTable = ({ roles }: RolesTableProps) => {
  return (
    <Table verticalSpacing={'sm'}>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {roles.map((role) => {
          return (
            <Table.Tr key={`${role.id}-role-row`}>
              <Table.Td>
                <Link viewTransition to={`/roles/${role.id}/edit`}>
                  {role.name}
                </Link>
              </Table.Td>
            </Table.Tr>
          );
        })}
      </Table.Tbody>
    </Table>
  );
};
