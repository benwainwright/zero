import { Text, Box, useMantineTheme, Stack, Card, Flex } from '@mantine/core';
import type { LiteralUnion } from 'type-fest';

export interface StackFrame {
  file: string | null;
  methodName: LiteralUnion<'<unknown>', string>;
  arguments: string[];
  lineNumber: number | null;
  column: number | null;
}

interface StackTraceProps {
  trace: StackFrame[];
}

export const StackTrace = ({ trace }: StackTraceProps) => {
  const theme = useMantineTheme();
  return (
    <Card pl={0}>
      <Stack gap={'0.6rem'} m={0}>
        {trace.map((item) => (
          <Stack gap={0} p={0} m={0}>
            <Box p={0} m={0}>
              <Text ff={'monospace'} style={{ fontSize: '0.8rem' }}>
                <span
                  style={{ fontWeight: 'bold', color: theme.colors.red[8] }}
                >
                  {item.file}
                </span>
              </Text>
            </Box>
            <Flex align={'center'} gap="xs">
              <Text pl="sm" ff={'monospace'} style={{ fontSize: '0.8rem' }}>
                <span style={{ color: theme.colors.gray[7] }}> in </span>
                {item.methodName}
                <span style={{ color: theme.colors.gray[7] }}>
                  {' '}
                  at{' '}
                </span>line {item.lineNumber}:{item.column}
              </Text>
            </Flex>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
};
