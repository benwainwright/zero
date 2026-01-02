import { mock } from 'vitest-mock-extended';
import { AbstractCommandHandler } from './abstract-command-handler.ts';
import { CommandBus } from './command-bus.ts';
import type { ICommand } from '@types';
import { type ICurrentUserCache } from '@ports';
import { when } from 'vitest-when';
import type { User } from '@zero/domain';

describe('command bus', () => {
  it('passes the command to the correct handler', async () => {
    const handlerOne = mock<AbstractCommandHandler<ICommand<string>, string>>();
    const handlerTwo = mock<AbstractCommandHandler<ICommand<string>, string>>();
    const cache = mock<ICurrentUserCache>();

    const mockUser = mock<User>();
    when(cache.get).calledWith().thenResolve(mockUser);

    const bus = new CommandBus([handlerOne, handlerTwo], cache);

    const mockCommand = mock<ICommand<string>>();

    when(handlerOne.tryHandle)
      .calledWith({
        command: mockCommand,
        authContext: mockUser,
      })
      .thenResolve(false);

    when(handlerTwo.tryHandle)
      .calledWith({
        command: mockCommand,
        authContext: mockUser,
      })
      .thenResolve(true);

    await bus.execute(mockCommand);

    expect(handlerOne.tryHandle).toHaveBeenCalled();
    expect(handlerTwo.tryHandle).toHaveBeenCalled();
  });
});
