import {
  type IIoHost,
  type IoMessage,
  type IoMessageCode,
  type IoRequest,
} from '@aws-cdk/toolkit-lib';
import { Identifier } from './identifier.ts';
import { identifiers } from './identifiers.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MessageWithCode<T extends Identifier<any, any>> = T extends Identifier<
  infer TData,
  infer TCode
>
  ? Omit<IoMessage<TData>, 'code'> & { code: TCode }
  : never;

export class Host implements IIoHost {
  // See https://docs.aws.amazon.com/cdk/api/toolkit-lib/message-registry/

  private readonly callbacks: ((
    message: MessageWithCode<(typeof identifiers)[number]>
  ) => Promise<void> | void)[] = [];

  private codesWithListeners: IoMessageCode[] = [];

  public async notify(msg: IoMessage<unknown>): Promise<void> {
    const identify = () => {
      for (const identifier of identifiers) {
        if (identifier.identify(msg)) {
          return msg;
        }
      }
      return undefined;
    };
    const identifiedMessage = identify();

    if (identifiedMessage) {
      for (const callback of this.callbacks) {
        await callback(identifiedMessage);
      }
    }
  }

  public onRest(
    callback: (
      message: MessageWithCode<(typeof identifiers)[number]>
    ) => Promise<void> | void
  ) {
    this.callbacks.push(
      async (message: MessageWithCode<(typeof identifiers)[number]>) => {
        if (!this.codesWithListeners.includes(message.code)) {
          await callback(message);
        }
      }
    );
  }

  public on<
    TCode extends MessageWithCode<(typeof identifiers)[number]>['code']
  >(
    code: TCode,
    callback: (
      data: Extract<
        MessageWithCode<(typeof identifiers)[number]>,
        { code: TCode }
      >
    ) => Promise<void> | void
  ) {
    type AnyMessage = MessageWithCode<(typeof identifiers)[number]>;

    function hasCode<TCode extends AnyMessage['code']>(
      message: AnyMessage,
      code: TCode
    ): message is Extract<AnyMessage, { code: TCode }> {
      return message.code === code;
    }

    this.codesWithListeners.push(code);

    this.callbacks.push(async (message) => {
      if (hasCode(message, code)) {
        await callback(message);
      }
    });
  }

  public async requestResponse<T>(msg: IoRequest<unknown, T>): Promise<T> {
    return msg.defaultResponse;
  }
}
