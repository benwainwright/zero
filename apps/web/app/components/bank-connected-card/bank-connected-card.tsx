import { DateLabel } from '@components';
import { Card, Text, Image, Table, Flex } from '@mantine/core';
import { DateTime } from 'luxon';
interface BankConnectionConnectedProps {
  details: {
    logo: string;
    bankName: string;
    connected: Date;
    refreshed: Date | undefined;
    expires: Date;
  };
}

export const BankConnectedCard = ({
  details,
}: BankConnectionConnectedProps) => {
  console.log(details);
  return (
    <>
      <Text>You are successfully connected to your bank</Text>
      <Card shadow="sm" padding="xl" my="lg" radius="md" withBorder>
        <Flex mt="md" mb="xs">
          <Card.Section m="lg">
            <Image
              src={details.logo}
              width="auto"
              alt={details.bankName}
              style={{ maxWidth: '300px' }}
            />
          </Card.Section>

          <Table variant="vertical" mx="xl" withTableBorder>
            <Table.Tr>
              <Table.Th pl="lg">Bank</Table.Th>
              <Table.Td>{details.bankName}</Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th pl="lg">Connection Date</Table.Th>
              <Table.Td>
                {
                  <DateLabel
                    date={details.connected}
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
                    date={details.expires}
                    formatOptions={DateTime.DATETIME_FULL}
                  ></DateLabel>
                }
              </Table.Td>
            </Table.Tr>
          </Table>
        </Flex>
      </Card>
    </>
  );
};
