import { mock } from 'vitest-mock-extended';
import { UserRepositoryAuthEventStager } from './user-repository-auth-event-stager.ts';
import type { IUserRepository } from '@ports';
import { type IDomainEventBuffer } from '@zero/application-core';
import { User } from '@zero/domain';
import { when } from 'vitest-when';

describe('auth event stager', () => {
  it('passes the call through to the underlying repo for all methods', async () => {
    const repo = mock<IUserRepository>();
    const buffer = mock<IDomainEventBuffer>();
    const stager = new UserRepositoryAuthEventStager(repo, buffer);

    const user = mock<User>();
    when(repo.saveUser).calledWith(user).thenResolve(user);
    when(repo.requireUser).calledWith('id').thenResolve(user);
    when(repo.getUser).calledWith('id').thenResolve(user);
    when(repo.getManyUsers).calledWith(0, 10).thenResolve([user]);

    await stager.saveUser(user);
    expect(repo.saveUser).toHaveBeenCalledWith(user);

    const result = await stager.requireUser('id');
    expect(result).toEqual(user);

    const otherResult = await stager.getUser('id');
    expect(otherResult).toEqual(user);

    const manyResults = await stager.getManyUsers(0, 10);
    expect(manyResults).toEqual([user]);

    await stager.deleteUser(user);
    expect(repo.deleteUser).toHaveBeenCalledWith(user);
  });

  it('calls the event buffer for write methods', async () => {
    const repo = mock<IUserRepository>();
    const buffer = mock<IDomainEventBuffer>();
    const stager = new UserRepositoryAuthEventStager(repo, buffer);

    const user = mock<User>();
    when(repo.saveUser).calledWith(user).thenResolve(user);

    await stager.saveUser(user);
    expect(buffer.stageEvents).toHaveBeenCalledWith(user);

    await stager.deleteUser(user);
    expect(buffer.stageEvents).toHaveBeenCalledWith(user);
  });
});
