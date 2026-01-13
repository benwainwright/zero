import { DateLabel } from '@components';
import { Title, Text, Accordion, Pill, Flex, Table } from '@mantine/core';
import { HttpRequestsContext } from '@zero/react-api';
import { DateTime } from 'luxon';
import { useContext } from 'react';

export const HttpRequestsPanel = () => {
  const { records } = useContext(HttpRequestsContext);
  return (
    <>
      <Title order={3}>HTTP Requests</Title>
      <Accordion mt="md" variant="contained">
        {records.map((record) => (
          <Accordion.Item
            key={record.request.requestId}
            value={record.request.requestId}
          >
            <Accordion.Control>
              <Flex
                gap="1rem"
                justify={'space-between'}
                pr="lg"
                align={'center'}
              >
                {record.response ? (
                  <Pill ff="monospace" size="xs">
                    {'statusCode' in record.response
                      ? record.response.statusCode
                      : 'cached'}
                  </Pill>
                ) : null}
                <Text ff="monospace" size="xs" style={{ flexGrow: 2 }}>
                  {record.request.url}
                </Text>
                <Pill size="xs" ff="monospace">
                  {record.request.method}
                </Pill>
              </Flex>
            </Accordion.Control>
            <Accordion.Panel p="lg">
              <Table variant="vertical">
                <Table.Tbody>
                  <Table.Tr>
                    <Table.Th>Sent</Table.Th>
                    <Table.Td>
                      <DateLabel
                        date={record.request.time}
                        formatOptions={DateTime.DATETIME_FULL}
                      />
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Th>Request Headers</Table.Th>
                    <Table.Td>
                      {JSON.stringify(record.request.headers)}
                    </Table.Td>
                  </Table.Tr>
                  {'body' in record.request && (
                    <Table.Tr>
                      <Table.Th>Request Body</Table.Th>
                      <Table.Td>{JSON.stringify(record.request.body)}</Table.Td>
                    </Table.Tr>
                  )}
                  {record.response && 'headers' in record.response && (
                    <Table.Tr>
                      <Table.Th>Response Headers</Table.Th>
                      <Table.Td>
                        {JSON.stringify(record.response.headers)}
                      </Table.Td>
                    </Table.Tr>
                  )}
                  {record.response && (
                    <Table.Tr>
                      <Table.Th>Response Body</Table.Th>
                      <Table.Td>
                        {JSON.stringify(record.response.body)}
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </>
  );
};
