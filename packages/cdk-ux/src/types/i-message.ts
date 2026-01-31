import type { IoMessageCode, IoMessageLevel } from '@aws-cdk/toolkit-lib';

export interface IMessage {
  message: string;
  timestamp: Date;
  level: IoMessageLevel;
  code: IoMessageCode | undefined;
}
