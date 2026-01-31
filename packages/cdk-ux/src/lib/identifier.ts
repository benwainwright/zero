import type { IoMessage, IoMessageCode } from '@aws-cdk/toolkit-lib';

export class Identifier<TPayload, TCode extends IoMessageCode> {
  public constructor(public readonly code: TCode) {}

  public identify(
    message: IoMessage<unknown>
  ): message is Omit<IoMessage<TPayload>, 'code'> & { code: TCode } {
    return message.code === this.code;
  }
}
