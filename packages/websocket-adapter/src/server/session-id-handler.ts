import type { ConfigValue, ILogger } from '@zero/bootstrap';
import cookie from 'cookie';
import { IncomingMessage } from 'http';

import { WebsocketServerError } from './websocket-server-error.ts';
import { injectable } from 'inversify';
import { inject } from './typed-inject.ts';
import type { IUUIDGenerator } from '@types';

export const SESSION_ID_COOKIE_KEY = `zero-session-id`;

export const LOG_CONTEXT = { context: 'session-id-handler' };

@injectable()
export class SessionIdHandler {
  public constructor(
    @inject('Logger')
    private logger: ILogger,

    @inject('SessionIdCookieKey')
    private key: string,

    @inject('UUIDGenerator')
    private uuidGenerator: IUUIDGenerator,

    @inject('CookieDomain')
    private readonly cookieDomain: ConfigValue<string>
  ) {}

  private sessionIds = new WeakMap<IncomingMessage, string>();

  public async setSesionId(headers: string[], request: IncomingMessage) {
    const existingId = this.parseSessionIdFromRequest(request);

    if (existingId) {
      this.sessionIds.set(request, existingId);
    } else {
      const newId = this.uuidGenerator.v7();
      headers.push(
        `Set-Cookie: ${this.key}=${newId}; HttpOnly; Secure; ${this.cookieDomain.value}`
      );
      this.sessionIds.set(request, newId);
    }
  }

  private parseSessionIdFromRequest(
    request: IncomingMessage
  ): string | undefined {
    const cookies = cookie.parse(request.headers.cookie ?? '');
    const key = cookies[this.key];
    if (key) {
      this.logger.silly(`Found session id in cookies: ${key}`, LOG_CONTEXT);
      return key;
    } else {
      this.logger.silly(`No session id found in cookies`, LOG_CONTEXT);
    }
    return undefined;
  }

  public getSessionId(request: IncomingMessage): string {
    const id = this.sessionIds.get(request);
    this.logger.debug(
      `Retrieving session id ${String(id)} from session id store`,
      LOG_CONTEXT
    );
    if (!id) {
      throw new WebsocketServerError(`No id was found`);
    }
    return id;
  }
}
