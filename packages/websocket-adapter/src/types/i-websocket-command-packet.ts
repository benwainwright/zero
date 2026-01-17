import type { IKnownRequests } from './i-known-requests.ts';

export type IWebsocketCommandPacket = {
  type: 'command';
  packet: IKnownRequests;
};
