import { DateLabel } from '@components';
import { Card, Text, Image, Table, Flex, Button, Stack } from '@mantine/core';
import { DateTime } from 'luxon';
interface BankConnectionConnectedProps {
  name: string;
  logo: string;
  created: Date;
  refreshed: Date | undefined;
  expires: Date;
  onDisconnect: () => void;
}

export const BankConnectedCard = ({
  logo,
  name,
  onDisconnect,
  created,
  refreshed,
  expires,
}: BankConnectionConnectedProps) => {
  return (
    <>
      <Text>You are successfully connected to your bank</Text>
      <Card shadow="sm" padding="xl" my="lg" radius="md" withBorder>
        <Stack justify="start" align="end">
          <Flex mt="md" mb="xs">
            <Card.Section m="lg">
              <Image
                src={logo}
                width="auto"
                alt={name}
                style={{ maxWidth: '300px' }}
              />
            </Card.Section>

            <Table variant="vertical" mx="xl" withTableBorder>
              <Table.Tbody>
                <Table.Tr>
                  <Table.Th pl="lg">Bank</Table.Th>
                  <Table.Td>{name}</Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th pl="lg">Connection Date</Table.Th>
                  <Table.Td>
                    {
                      <DateLabel
                        date={created}
                        formatOptions={DateTime.DATETIME_FULL}
                      ></DateLabel>
                    }
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Th pl="lg">Token Expires</Table.Th>
                  <Table.Td>
                    {
                      <DateLabel
                        date={expires}
                        formatOptions={DateTime.DATETIME_FULL}
                      ></DateLabel>
                    }
                  </Table.Td>
                </Table.Tr>
                {refreshed && (
                  <Table.Tr>
                    <Table.Th pl="lg">Token Last Refreshed</Table.Th>
                    <Table.Td>
                      {
                        <DateLabel
                          date={refreshed}
                          formatOptions={DateTime.DATETIME_FULL}
                        ></DateLabel>
                      }
                    </Table.Td>
                  </Table.Tr>
                )}
              </Table.Tbody>
            </Table>
          </Flex>
          <Button
            color="red"
            mx="xl"
            mt="lg"
            radius="md"
            onClick={onDisconnect}
          >
            Disconnect
          </Button>
        </Stack>
      </Card>
    </>
  );
};
