import { type ILogger } from '@zero/bootstrap';
import { mock } from 'vitest-mock-extended';
import { SessionIdHandler } from './session-id-handler.ts';
import { IncomingMessage } from 'node:http';
import { when } from 'vitest-when';
import { type IUUIDGenerator } from '@types';

describe('session id handler', () => {
  describe('set session id', () => {
    it('does nothing to the headers array if the cookie is already there', () => {
      const logger = mock<ILogger>();
      const uuidGenerator = mock<IUUIDGenerator>();

      const handler = new SessionIdHandler(
        logger,
        'key-session',
        uuidGenerator,
        mock()
      );

      const headers: string[] = [];

      const request = mock<IncomingMessage>({
        headers: {
          cookie: 'key-session=foo',
        },
      });

      handler.setSesionId(headers, request);

      expect(headers).toEqual([]);
    });

    it('adds the set cookie header if it is not already present or a different cookies is present', () => {
      const logger = mock<ILogger>();
      const uuidGenerator = mock<IUUIDGenerator>();
      const handler = new SessionIdHandler(
        logger,
        'key-session',
        uuidGenerator,
        mock()
      );

      const headers: string[] = [];

      const request = mock<IncomingMessage>({
        headers: {
          cookie: 'other-cookie=foo;',
        },
      });

      when(uuidGenerator.v7).calledWith().thenReturn('foo-id');

      handler.setSesionId(headers, request);

      expect(headers).toEqual(['Set-Cookie: key-session=foo-id; HttpOnly;']);
    });
  });

  describe('get session id', () => {
    it('restores previously saved session id', () => {
      const logger = mock<ILogger>();
      const uuidGenerator = mock<IUUIDGenerator>();

      const handler = new SessionIdHandler(
        logger,
        'key-session',
        uuidGenerator,
        mock()
      );

      const headers: string[] = [];

      const request = mock<IncomingMessage>({
        headers: {
          cookie: 'key-session=foo',
        },
      });

      handler.setSesionId(headers, request);
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
        mock()
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
