import { inject } from './typed-inject.ts';
import { AppError } from '@errors';
import {
  type IObjectStorage,
  type ISessionIdRequester,
  type ISingleItemStore,
} from '@ports';
import { type ILogger } from '@zero/bootstrap';
import { User } from '@zero/domain';
import { Serialiser } from '@zero/serialiser';
import { injectable } from 'inversify';

export const LOG_CONTEXT = { context: 'session-storage' };

@injectable()
export class SessionStorage implements ISingleItemStore<User> {
  public constructor(
    @inject('ObjectStore')
    private storage: IObjectStorage,

    @inject('SessionIdRequester')
    private sessionIdRequester: ISessionIdRequester,

    @inject('Serialiser')
    private readonly serialiser: Serialiser,

    @inject('Logger')
    private logger: ILogger
  ) {}

  public async require(): Promise<User> {
    const item = await this.get();

    if (!item) {
      throw new AppError(
        `Session data required but was not found. This method should not be called when the user is logged out`
      );
    }

    return item;
  }

  public async get(): Promise<User | undefined> {
    const sessionId = await this.sessionIdRequester.getSessionId();
    const key = `${sessionId}-session-key`;

    this.logger.silly(`Received session key: ${key}`, LOG_CONTEXT);
    const sessionData = await this.storage.get('sessions', key);
    this.logger.silly(
      `Received session data: ${JSON.stringify(sessionData)}`,
      LOG_CONTEXT
    );

    if (!sessionData) {
      return undefined;
    }
    const data = this.serialiser.deserialise(sessionData);

    if (data instanceof User) {
      return data;
    }
    throw new AppError(`Something strange was found in session data`);
  }

  async set(thing: User | undefined): Promise<void> {
    const sessionId = await this.sessionIdRequester.getSessionId();

    this.logger.silly(
      `Saving session data: ${JSON.stringify(thing)}`,
      LOG_CONTEXT
    );

    await this.storage.set(
      'sessions',
      `${sessionId}-session-key`,
      thing ? this.serialiser.serialise(thing) : undefined
    );
  }
}
