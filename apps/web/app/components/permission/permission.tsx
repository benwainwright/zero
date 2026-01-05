import { Card, Stack, Table } from '@mantine/core';
import type { IPermission } from '@zero/domain';

interface PermissionProps {
  permission: IPermission;
}

export const Permission = ({ permission }: PermissionProps) => {
  return (
    <Card withBorder radius="md" padding="md" shadow="sm">
      <Card.Section>
        <Stack>
          <Table variant="vertical" layout="fixed">
            <Table.Tbody>
              <Table.Tr>
                <Table.Th>Action</Table.Th>
                <Table.Td>{permission.action}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Capabilities</Table.Th>
                <Table.Td>{permission.capabilities.join(', ')}</Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Th>Resource</Table.Th>
                <Table.Td>
                  {typeof permission.resource === 'string'
                    ? permission.resource
                    : permission.resource.id}
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Stack>
      </Card.Section>
    </Card>
  );
};
