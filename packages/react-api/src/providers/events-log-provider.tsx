import { useEventsLog } from '@hooks';
import type { IEventPacket } from '@zero/application-core';
import type { IKnownEvents } from '@zero/websocket-adapter/client';
import { createContext, type ReactNode } from 'react';

export interface EventLogContextType {
  clear?: (() => void) | undefined;
  events: (IEventPacket<IKnownEvents, keyof IKnownEvents> & {
    index: number;
  })[];
}

export const EventsLogContext = createContext<EventLogContextType>({
  events: [],
});

const notProd = process.env['NODE_ENV'] !== 'production';

interface EventsLogProviderProps {
  children: ReactNode;
}

export const EventsLogProvider = ({ children }: EventsLogProviderProps) => {
  const { events, clear } = notProd
    ? useEventsLog()
    : {
        events: [],
        clear: undefined,
      };

  return (
    <EventsLogContext value={{ events, clear }}>{children}</EventsLogContext>
  );
};
