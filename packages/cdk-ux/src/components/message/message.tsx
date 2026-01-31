import type { IoMessageCode, IoMessageLevel } from '@aws-cdk/toolkit-lib';
import { Box, Text } from 'ink';
import type { ReactNode } from 'react';

interface MessageProps {
  message: {
    level: IoMessageLevel;
    message: string;
    code?: IoMessageCode | undefined;
  };
}

export const Message = ({ message }: MessageProps) => {
  const emojis: Record<IoMessageLevel, ReactNode> = {
    result: <Text>✅</Text>,
    error: (
      <Text color="red" bold>
        ❌
      </Text>
    ),
    info: <Text bold>🔍</Text>,
    debug: <Text>🐛</Text>,
    trace: <Text>🎯</Text>,
    warn: <Text>⚠️</Text>,
  };

  const normaliseString = (text: string) =>
    text
      .replace(/❌/g, '')
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .join(' ');

  return (
    <Box gap={1} flexDirection="row" justifyContent="space-around">
      <Box width={2} alignItems="center" justifyContent="flex-end">
        {emojis[message.level]}
      </Box>
      <Box justifyContent="flex-start" gap={1} flexGrow={2}>
        <Text>{normaliseString(message.message)}</Text>
      </Box>
      <Box>
        <Text color="grey">{message.code}</Text>
      </Box>
    </Box>
  );
};
