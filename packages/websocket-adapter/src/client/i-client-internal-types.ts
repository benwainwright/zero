import type { IKnownCommands, IUUIDGenerator } from '@types';
import type { ICommandClient } from '@zero/application-core';

export interface IClientInternalTypes {
  Websocket: WebSocket;
  CommandClient: ICommandClient<IKnownCommands>;
  UUIDGenerator: IUUIDGenerator;
}
