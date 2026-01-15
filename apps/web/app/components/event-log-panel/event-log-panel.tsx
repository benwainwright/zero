import { EventLogControl } from '@components';
import { Accordion, Code } from '@mantine/core';
import type { IEventPacket } from '@zero/application-core';
import type { IKnownEvents } from '@zero/websocket-adapter/client';

interface EventLogPanelProps {
  events: (IEventPacket<IKnownEvents, keyof IKnownEvents> & {
    index: number;
  })[];
}

export const EventLogPanel = ({ events }: EventLogPanelProps) => {
  return (
    <Accordion mt="md" variant="contained">
      {events.map((item) => (
        <Accordion.Item
          key={`event-accordion-item-${item.index}`}
          value={`event-accordion-item-${item.index}`}
        >
          <EventLogControl event={item} />
          <Accordion.Panel>
            <Code block>{JSON.stringify(item.data, null, 2)}</Code>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};
