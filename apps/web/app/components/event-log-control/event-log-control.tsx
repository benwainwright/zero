import { Accordion, Box, Flex, Pill, useMantineTheme } from '@mantine/core';
import type { IEventPacket } from '@zero/application-core';
import type { IKnownEvents } from '@zero/websocket-adapter/client';

export interface EventLogControlProps {
  event: IEventPacket<IKnownEvents, keyof IKnownEvents> & { index: number };
}

const getLabel = (
  event: IEventPacket<IKnownEvents, keyof IKnownEvents> & { index: number }
) => {
  switch (event.key) {
    case 'QueryHandleCompleteEvent':
    case 'QueryHandleStartEvent':
    case 'QueryResponseEvent':
    case 'CommandHandleCompleteEvent':
    case 'CommandHandleStartEvent':
      return <Pill>{event.data.key}</Pill>;
    default:
      return null;
  }
};

export const EventLogControl = ({ event }: EventLogControlProps) => {
  const theme = useMantineTheme();
  return (
    <Accordion.Control styles={{ label: { padding: 0 } }}>
      <Flex gap="1rem" p={0} m={0} align={'center'}>
        <Box
          p="xs"
          style={{
            borderRight: `1px solid ${theme.colors.gray[3]}`,
            width: '17rem',
          }}
          m={0}
        >
          <strong>{event.key}</strong>
        </Box>
        {getLabel(event)}
      </Flex>
    </Accordion.Control>
  );
};
