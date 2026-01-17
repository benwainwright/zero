import type { IKnownRequests } from './i-known-requests.ts';

export type IWebsocketRequestPacket = {
  type: 'request';
  packet: IKnownRequests;
};
