import type { IKnownCommands } from './i-known-commands.ts';

export type IWebsocketCommandPacket = {
  type: 'command';
  packet: IKnownCommands;
};
