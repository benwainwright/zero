import {
  type IObjectStorage,
  type ISessionIdRequester,
} from '@zero/application-core';

import { mock } from 'vitest-mock-extended';
import { SessionStorage } from './session-storage.ts';
import { when } from 'vitest-when';
import type { ILogger } from '@zero/bootstrap';
import { Serialiser } from '@zero/serialiser';
import { User } from '@zero/domain';
import { AuthError } from './auth-error.ts';

describe('session storage', () => {
  describe('require', () => {
    it('returns the user if they are present', async () => {
      const objectStorage = mock<IObjectStorage>();
      const sessionIdRequester = mock<ISessionIdRequester>();
      const serialiser = mock<Serialiser>();
      const logger = mock<ILogger>();

      const storage = new SessionStorage(
        objectStorage,
        sessionIdRequester,
        serialiser,
        logger
      );

      when(sessionIdRequester.getSessionId)
        .calledWith()
        .thenResolve('foo-session');

      const user = 'a-user';

      when(objectStorage.get)
        .calledWith('sessions', `foo-session-session-key`)
        .thenResolve(user);

      const mockUser = User.reconstitute({
        id: 'foo',
        email: 'a',
        passwordHash: 'a',
        roles: [],
      });

      when(serialiser.deserialise).calledWith(user).thenReturn(mockUser);

      const result = await storage.require();

      expect(result).toEqual(mockUser);
    });

    it('throws an error if there is no user', async () => {
      const objectStorage = mock<IObjectStorage>();
      const sessionIdRequester = mock<ISessionIdRequester>();
      const serialiser = mock<Serialiser>();
      const logger = mock<ILogger>();

      const storage = new SessionStorage(
        objectStorage,
        sessionIdRequester,
        serialiser,
        logger
      );

      when(sessionIdRequester.getSessionId)
        .calledWith()
        .thenResolve('foo-session');

      when(objectStorage.get)
        .calledWith('sessions', `foo-session-session-key`)
        .thenResolve(undefined);

      await expect(storage.require()).rejects.toThrow();
    });
  });

  describe('set', () => {
    it('stores undefined if undefined is passed in', async () => {
      const objectStorage = mock<IObjectStorage>();
      const sessionIdRequester = mock<ISessionIdRequester>();
      const serialiser = mock<Serialiser>();
      const logger = mock<ILogger>();

      const storage = new SessionStorage(
        objectStorage,
        sessionIdRequester,
        serialiser,
        logger
      );

      when(sessionIdRequester.getSessionId)
        .calledWith()
        .thenResolve('foo-session');

      await storage.set(undefined);

      expect(objectStorage.set).toHaveBeenCalledWith(
        'sessions',
        'foo-session-session-key',
        undefined
      );
    });

    it('stores the user deserialised with the right session key', async () => {
      const objectStorage = mock<IObjectStorage>();
      const sessionIdRequester = mock<ISessionIdRequester>();
      const serialiser = mock<Serialiser>();
      const logger = mock<ILogger>();

      const storage = new SessionStorage(
        objectStorage,
        sessionIdRequester,
        serialiser,
        logger
      );

      when(sessionIdRequester.getSessionId)
        .calledWith()
        .thenResolve('foo-session');

      const mockUser = mock<User>();

      when(serialiser.serialise).calledWith(mockUser).thenReturn('foo');

      await storage.set(mockUser);

      expect(objectStorage.set).toHaveBeenCalledWith(
        'sessions',
        'foo-session-session-key',
        'foo'
      );
    });
  });
  describe('get', () => {
    it('returns undefinied if the object storage has nothing in it for the session key', async () => {
      const objectStorage = mock<IObjectStorage>();
      const sessionIdRequester = mock<ISessionIdRequester>();
      const serialiser = mock<Serialiser>();
      const logger = mock<ILogger>();

      const storage = new SessionStorage(
        objectStorage,
        sessionIdRequester,
        serialiser,
        logger
      );

      when(sessionIdRequester.getSessionId)
        .calledWith()
        .thenResolve('foo-session');

      when(objectStorage.get)
        .calledWith('sessions', `foo-session-session-key`)
        .thenResolve(undefined);

      const result = await storage.get();

      expect(result).toBeUndefined();
    });

    it('throws an error if there is invalid data', async () => {
      const objectStorage = mock<IObjectStorage>();
      const sessionIdRequester = mock<ISessionIdRequester>();
      const serialiser = mock<Serialiser>();
      const logger = mock<ILogger>();

      const storage = new SessionStorage(
        objectStorage,
        sessionIdRequester,
        serialiser,
        logger
      );

      when(sessionIdRequester.getSessionId)
        .calledWith()
        .thenResolve('foo-session');

      const user = 'a-user';

      when(objectStorage.get)
        .calledWith('sessions', `foo-session-session-key`)
        .thenResolve(user);

      when(serialiser.deserialise).calledWith(user).thenReturn({ foo: 'bar' });

      await expect(storage.get()).rejects.toThrow(AuthError);
    });

    it('returns the user if the object store contains a user', async () => {
      const objectStorage = mock<IObjectStorage>();
      const sessionIdRequester = mock<ISessionIdRequester>();
      const serialiser = mock<Serialiser>();
      const logger = mock<ILogger>();

      const storage = new SessionStorage(
        objectStorage,
        sessionIdRequester,
        serialiser,
        logger
      );

      when(sessionIdRequester.getSessionId)
        .calledWith()
        .thenResolve('foo-session');

      const user = 'a-user';

      when(objectStorage.get)
        .calledWith('sessions', `foo-session-session-key`)
        .thenResolve(user);

      const mockUser = User.reconstitute({
        id: 'foo',
        email: 'a',
        passwordHash: 'a',
        roles: [],
      });

      when(serialiser.deserialise).calledWith(user).thenReturn(mockUser);

      const result = await storage.get();

      expect(result).toEqual(mockUser);
    });
  });
});
