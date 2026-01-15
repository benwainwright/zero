import { DateLabel } from '@components';
import {
  Text,
  Accordion,
  Pill,
  Flex,
  Table,
  Code,
  useMantineTheme,
  type MantineTheme,
} from '@mantine/core';
import { HttpRequestsContext } from '@zero/react-api';
import { DateTime } from 'luxon';
import { useContext } from 'react';

const formatJson = (json: unknown | undefined): string => {
  if (typeof json === 'object') {
    return JSON.stringify(json, null, 2);
  }

  if (typeof json === 'string') {
    return JSON.stringify(JSON.parse(json), null, 2);
  }

  throw new Error('Unexpected type');
};

const getStatusColor = (status: number | 'cached', theme: MantineTheme) => {
  if (status === 'cached') {
    return theme.colors.blue[2];
  }

  if (status >= 200 && status < 300) {
    return theme.colors.green[2];
  }

  if (status >= 300 && status < 400) {
    return theme.colors.yellow[2];
  }

  if (status >= 400) {
    return theme.colors.red[2];
  }

  return theme.colors.gray[2];
};

export const HttpRequestsPanel = () => {
  const { records } = useContext(HttpRequestsContext);
  const theme = useMantineTheme();
  return (
    <Accordion mt="md" variant="contained">
      {records.map((record) => {
        const status =
          record && record.response && 'statusCode' in record.response
            ? record.response.statusCode
            : 'cached';
        return (
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
                  <Pill
                    ff="monospace"
                    size="xs"
                    bg={getStatusColor(status, theme)}
                  >
                    {status}
                  </Pill>
                ) : (
                  <Pill>...</Pill>
                )}
                <Text ff="monospace" size="xs" style={{ flexGrow: 2 }}>
                  {record.request.url}
                </Text>
                <Pill size="xs" ff="monospace">
                  {record.request.method}
                </Pill>
              </Flex>
            </Accordion.Control>
            <Accordion.Panel p="lg" style={{ overflow: 'scroll' }}>
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
                      <Code block>
                        {JSON.stringify(record.request.headers, null, 2)}
                      </Code>
                    </Table.Td>
                  </Table.Tr>
                  {'body' in record.request && (
                    <Table.Tr>
                      <Table.Th>Request Body</Table.Th>
                      <Table.Td>
                        <Code block style={{ overflow: 'hidden' }}>
                          {JSON.stringify(record.request.body, null, 2)}
                        </Code>
                      </Table.Td>
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
                        <Code block>{formatJson(record.response.body)}</Code>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
};
