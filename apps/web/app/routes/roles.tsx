import { Loader, Page } from '@components';
import { Table } from '@mantine/core';
import { useRoles } from '@zero/react-api';
import { Link } from 'react-router';

export const Roles = () => {
  const roles = useRoles(0, 30);
  return (
    <Page routeName="roles">
      <Loader data={roles}>
        {(data) => (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data.map((role) => {
                return (
                  <Table.Tr key={`${role.id}-role-row`}>
                    <Table.Td>
                      <Link to={`/roles/${role.id}/edit`}>{role.name}</Link>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        )}
      </Loader>
    </Page>
  );
};

export default Roles;
