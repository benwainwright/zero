import {
  type IDomainEventStore,
  type ICommandBus,
  type IUnitOfWork,
} from '@ports';

import { mock } from 'vitest-mock-extended';
import { TransactionalCommandBus } from './transactional-command-bus.ts';
import { type ILogger } from '@zero/bootstrap';
import { when } from 'vitest-when';
import type { CommandBus } from './command-bus.ts';
import type { ICommand } from '@types';

describe('transactional service bus', () => {
  it('passes the command to the parent command bus', async () => {
    const parent = mock<ICommandBus>();
    const unit = mock<IUnitOfWork>();

    const logger = mock<ILogger>();
    const domainEventEmitter = mock<IDomainEventStore>();

    const bus = new TransactionalCommandBus(
      parent,
      unit,
      domainEventEmitter,
      logger
    );

    const mockCommand = mock<ICommand<string>>();

    await bus.execute(mockCommand);

    expect(parent.execute).toHaveBeenCalledWith(mockCommand);
  });

  it('wraps command execution with begin and commit', async () => {
    const parent = mock<CommandBus>();
    const unit = mock<IUnitOfWork>();

    const logger = mock<ILogger>();
    const domainEventEmitter = mock<IDomainEventStore>();

    const bus = new TransactionalCommandBus(
      parent,
      unit,
      domainEventEmitter,
      logger
    );

    const mockCommand = mock<ICommand<string>>();

    await bus.execute(mockCommand);

    expect(unit.begin).toHaveBeenCalledBefore(parent.execute);
    expect(unit.commit).toHaveBeenCalledAfter(parent.execute);
    expect(domainEventEmitter.flush).toHaveBeenCalled();
  });

  it('calls rollback and rethrows error if there is an error in commit', async () => {
    const parent = mock<CommandBus>();
    const unit = mock<IUnitOfWork>();

    const logger = mock<ILogger>();

    const domainEventEmitter = mock<IDomainEventStore>();

    const bus = new TransactionalCommandBus(
      parent,
      unit,
      domainEventEmitter,
      logger
    );

    const mockCommand = mock<ICommand<string>>();

    when(unit.commit).calledWith().thenReject(new Error());

    await expect(bus.execute(mockCommand)).rejects.toThrow();

    expect(unit.rollback).toHaveBeenCalled();
  });

  it('calls rollback and rethrows error if there is an error in the service bus execute method', async () => {
    const parent = mock<ICommandBus>();
    const unit = mock<IUnitOfWork>();

    const events = mock<IDomainEventStore>();
    const logger = mock<ILogger>();

    const bus = new TransactionalCommandBus(parent, unit, events, logger);

    const mockCommand = mock<ICommand<string>>();

    when(parent.execute).calledWith(mockCommand).thenReject(new Error());

    await expect(bus.execute(mockCommand)).rejects.toThrow();

    expect(unit.rollback).toHaveBeenCalled();
  });

  it('does not emit events if there is an error', async () => {
    const parent = mock<ICommandBus>();
    const unit = mock<IUnitOfWork>();

    const events = mock<IDomainEventStore>();
    const logger = mock<ILogger>();

    const bus = new TransactionalCommandBus(parent, unit, events, logger);

    const mockCommand = mock<ICommand<string>>();

    when(parent.execute).calledWith(mockCommand).thenReject();

    try {
      await bus.execute(mockCommand);
    } catch {
      // NOOP
    }

    expect(events.flush).not.toHaveBeenCalledWith();
    expect(events.purge).toHaveBeenCalledWith();
  });
});
