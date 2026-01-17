import type { IServiceBus, IUnitOfWork } from '@ports';
import type { ILogger } from '@zero/bootstrap';
import { mock } from 'vitest-mock-extended';
import { TransactionalServiceBus } from './transactional-service-bus.ts';
import type { IRequest } from '@types';
import { when } from 'vitest-when';

describe('transactional service bus', () => {
  it('passes the command to the parent command bus', async () => {
    const parent = mock<IServiceBus>();
    const unit = mock<IUnitOfWork>();

    const logger = mock<ILogger>();

    const bus = new TransactionalServiceBus(parent, unit, logger);

    const mockQuery = mock<IRequest<string>>();

    await bus.execute(mockQuery);

    expect(parent.execute).toHaveBeenCalledWith(mockQuery);
  });

  it('wraps command execution with begin and commit', async () => {
    const parent = mock<IServiceBus>();
    const unit = mock<IUnitOfWork>();

    const logger = mock<ILogger>();

    const bus = new TransactionalServiceBus(parent, unit, logger);

    const mockQuery = mock<IRequest<string>>();

    await bus.execute(mockQuery);

    expect(parent.execute).toHaveBeenCalledWith(mockQuery);

    expect(unit.begin).toHaveBeenCalledBefore(parent.execute);
    expect(unit.commit).toHaveBeenCalledAfter(parent.execute);
  });

  it('calls rollback and rethrows error if there is an error in commit', async () => {
    const parent = mock<IServiceBus>();
    const unit = mock<IUnitOfWork>();

    const logger = mock<ILogger>();

    const bus = new TransactionalServiceBus(parent, unit, logger);

    const mockQuery = mock<IRequest<string>>();

    when(unit.commit).calledWith().thenReject(new Error());
    await expect(bus.execute(mockQuery)).rejects.toThrow();

    expect(unit.rollback).toHaveBeenCalled();
  });
});
