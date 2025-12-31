import type { IKnownQueries } from './i-known-queries.ts';

export type IWebsocketQueryPacket = {
  type: 'query';
  packet: IKnownQueries;
};
