import { ConfigValue, type ILogger } from '@zero/bootstrap';
import { mock } from 'vitest-mock-extended';
import { SessionIdHandler } from './session-id-handler.ts';
import { IncomingMessage } from 'node:http';
import { when } from 'vitest-when';
import { type IUUIDGenerator } from '@types';

describe('session id handler', () => {
  describe('set session id', () => {
    it('does nothing to the headers array if the cookie is already there', async () => {
      const logger = mock<ILogger>();
      const uuidGenerator = mock<IUUIDGenerator>();

      const handler = new SessionIdHandler(
        logger,
        'key-session',
        uuidGenerator,
        new ConfigValue(Promise.resolve('localhost'))
      );

      const headers: string[] = [];

      const request = mock<IncomingMessage>({
        headers: {
          cookie: 'key-session=foo',
        },
      });

      await handler.setSesionId(headers, request);

      expect(headers).toEqual([]);
    });

    it('adds the set cookie header if it is not already present or a different cookies is present', async () => {
      const logger = mock<ILogger>();
      const uuidGenerator = mock<IUUIDGenerator>();
      const handler = new SessionIdHandler(
        logger,
        'key-session',
        uuidGenerator,
        new ConfigValue(Promise.resolve('localhost'))
      );

      const headers: string[] = [];

      const request = mock<IncomingMessage>({
        headers: {
          cookie: 'other-cookie=foo;',
        },
      });

      when(uuidGenerator.v7).calledWith().thenReturn('foo-id');

      await handler.setSesionId(headers, request);

      expect(headers).toEqual([
        'Set-Cookie: key-session=foo-id; HttpOnly; Secure; SameSite=None; domain=localhost;',
      ]);
    });
  });

  describe('get session id', () => {
    it('restores previously saved session id', async () => {
      const logger = mock<ILogger>();
      const uuidGenerator = mock<IUUIDGenerator>();

      const handler = new SessionIdHandler(
        logger,
        'key-session',
        uuidGenerator,
        new ConfigValue(Promise.resolve('localhost'))
      );

      const headers: string[] = [];

      const request = mock<IncomingMessage>({
        headers: {
          cookie: 'key-session=foo',
        },
      });

      await handler.setSesionId(headers, request);
      const id = handler.getSessionId(request);
      expect(id).toEqual('foo');
    });

    it('throws an error if called before the session id is saved', () => {
      const logger = mock<ILogger>();
      const uuidGenerator = mock<IUUIDGenerator>();

      const handler = new SessionIdHandler(
        logger,
        'key-session',
        uuidGenerator,
        new ConfigValue(Promise.resolve('localhost'))
      );

      const request = mock<IncomingMessage>({
        headers: {
          cookie: 'key-session=foo',
        },
      });

      expect(() => handler.getSessionId(request)).toThrow();
    });
  });
});
