import type {
  ICommand,
  ICommandBus,
  ICurrentUserCache,
} from '@zero/application-core';
import { mock } from 'vitest-mock-extended';
import { AuthorisingCommandBus } from './authorising-command-bus.ts';
import { type IGrantManager } from '@ports';
import { when } from 'vitest-when';
import type { User } from '@zero/domain';
import { buildInstance } from '@zero/test-helpers';

describe('authorising command bus', () => {
  it('delegates to the other command bus, sets the actor and calls done on the grant service', async () => {
    const [bus, , grantService, mockCurrentUserCache] = await buildInstance(
      AuthorisingCommandBus
    );

    const mockCommand = mock<ICommand<string>>();

    const mockUser = mock<User>();

    when(mockCurrentUserCache.get).calledWith().thenResolve(mockUser);

    await bus.execute(mockCommand);

    expect(grantService.setActor).toHaveBeenCalledWith(mockUser);
    expect(grantService.done).toHaveBeenCalled();
  });

  it('does not error if there is no user', async () => {
    const [bus, , grantService, mockCurrentUserCache] = await buildInstance(
      AuthorisingCommandBus
    );

    const mockCommand = mock<ICommand<string>>();

    when(mockCurrentUserCache.get).calledWith().thenResolve(undefined);

    await bus.execute(mockCommand);

    expect(grantService.setActor).not.toHaveBeenCalled();
    expect(grantService.done).toHaveBeenCalled();
  });
});
