import type { IQueryBus, IUnitOfWork } from '@ports';
import type { ILogger } from '@zero/bootstrap';
import { mock } from 'vitest-mock-extended';
import { TransactionalQueryBus } from './transactional-query-bus.ts';
import type { IQuery } from '@types';
import { when } from 'vitest-when';

describe('transactional service bus', () => {
  it('passes the command to the parent command bus', async () => {
    const parent = mock<IQueryBus>();
    const unit = mock<IUnitOfWork>();

    const logger = mock<ILogger>();

    const bus = new TransactionalQueryBus(parent, unit, logger);

    const mockQuery = mock<IQuery<string>>();

    await bus.execute(mockQuery);

    expect(parent.execute).toHaveBeenCalledWith(mockQuery);
  });

  it('wraps command execution with begin and commit', async () => {
    const parent = mock<IQueryBus>();
    const unit = mock<IUnitOfWork>();

    const logger = mock<ILogger>();

    const bus = new TransactionalQueryBus(parent, unit, logger);

    const mockQuery = mock<IQuery<string>>();

    await bus.execute(mockQuery);

    expect(parent.execute).toHaveBeenCalledWith(mockQuery);

    expect(unit.begin).toHaveBeenCalledBefore(parent.execute);
    expect(unit.commit).toHaveBeenCalledAfter(parent.execute);
  });

  it('calls rollback and rethrows error if there is an error in commit', async () => {
    const parent = mock<IQueryBus>();
    const unit = mock<IUnitOfWork>();

    const logger = mock<ILogger>();

    const bus = new TransactionalQueryBus(parent, unit, logger);

    const mockQuery = mock<IQuery<string>>();

    when(unit.commit).calledWith().thenReject(new Error());
    await expect(bus.execute(mockQuery)).rejects.toThrow();

    expect(unit.rollback).toHaveBeenCalled();
  });
});
