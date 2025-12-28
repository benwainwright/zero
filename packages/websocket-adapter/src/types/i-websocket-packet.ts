import type { IWebsocketCommandPacket } from './i-websocket-command-packet.ts';
import type { IWebsocketQueryPacket } from './i-websocket-query-packet.ts';

export type IWebsocketPacket = IWebsocketCommandPacket | IWebsocketQueryPacket;
