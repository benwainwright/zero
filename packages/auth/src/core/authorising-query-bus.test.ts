import type {
  IQuery,
  ICommandBus,
  ICurrentUserCache,
} from '@zero/application-core';
import { mock } from 'vitest-mock-extended';
import { type IGrantManager } from '@ports';
import { when } from 'vitest-when';
import type { User } from '@zero/domain';
import { AuthorisingQueryBus } from './authorising-query-bus.ts';

describe('authorising command bus', () => {
  it('delegates to the other command bus, sets the actor and calls done on the grant service', async () => {
    const parentCommandBus = mock<ICommandBus>();
    const mockCurrentUserCache = mock<ICurrentUserCache>();
    const grantService = mock<IGrantManager>();

    const bus = new AuthorisingQueryBus(
      parentCommandBus,
      grantService,
      mockCurrentUserCache
    );

    const mockQuery = mock<IQuery<string>>();

    const mockUser = mock<User>();

    when(mockCurrentUserCache.get).calledWith().thenResolve(mockUser);

    await bus.execute(mockQuery);

    expect(grantService.setActor).toHaveBeenCalledWith(mockUser);
    expect(grantService.done).toHaveBeenCalled();
  });

  it('does not error if there is no user', async () => {
    const parentCommandBus = mock<ICommandBus>();
    const mockCurrentUserCache = mock<ICurrentUserCache>();
    const grantService = mock<IGrantManager>();

    const bus = new AuthorisingQueryBus(
      parentCommandBus,
      grantService,
      mockCurrentUserCache
    );

    const mockQuery = mock<IQuery<string>>();

    when(mockCurrentUserCache.get).calledWith().thenResolve(undefined);

    await bus.execute(mockQuery);

    expect(grantService.setActor).not.toHaveBeenCalled();
    expect(grantService.done).toHaveBeenCalled();
  });
});
