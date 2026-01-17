import type { IEventSubscribe } from './i-event-subscribe.ts';
import type { IEventUnsubscribe } from './i-event-unsubscribe.ts';
import type { IWebsocketRequestPacket } from './i-websocket-request-packet.ts';

export type IWebsocketPacket =
  | IWebsocketRequestPacket
  | IEventSubscribe
  | IEventUnsubscribe;
