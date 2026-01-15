import { useEvents } from '@hooks';
import type { IEventPacket } from '@zero/application-core';
import type { IKnownEvents } from '@zero/websocket-adapter/client';
import { useState } from 'react';

export const useEventsLog = (): {
  events: (IEventPacket<IKnownEvents, keyof IKnownEvents> & {
    index: number;
  })[];
  clear: () => void;
} => {
  const [events, setEvents] = useState<
    (IEventPacket<IKnownEvents, keyof IKnownEvents> & { index: number })[]
  >([]);

  const clear = () => {
    setEvents([]);
  };

  useEvents((event) => {
    setEvents((oldEvents) => [
      ...oldEvents,
      { ...event, index: oldEvents.length },
    ]);
  });

  return { events, clear };
};
