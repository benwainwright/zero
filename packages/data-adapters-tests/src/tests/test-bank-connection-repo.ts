import type { IBankConnectionRepository } from '@zero/accounts';
import type { IUnitOfWork, IWriteRepository } from '@zero/application-core';
import { BankConnection, User } from '@zero/domain';

export const testBankConnectionRepository = (
  create: () => Promise<{
    repo: IBankConnectionRepository;
    writer: IWriteRepository<BankConnection>;
    userRepo: IWriteRepository<User>;
    unitOfWork: IUnitOfWork;
  }>
) => {
  it('can update and return a connection', async () => {
    const { repo, unitOfWork, userRepo, writer } = await create();
    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    const fred = User.reconstitute({
      email: 'a@b.c',
      id: 'fred',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
      await userRepo.save(fred);
    });

    const connectionOne = BankConnection.reconstitute({
      bankName: 'foo',
      id: 'foo-2',
      ownerId: 'ben',
      logo: 'bar',
      requisitionId: 'baz',
      accounts: ['foo', 'bar'],
    });

    const connectionTwo = BankConnection.reconstitute({
      bankName: 'foo',
      id: 'foo-3',
      ownerId: 'fred',
      logo: 'bar',
      requisitionId: 'baz',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(connectionOne);
      await writer.save(connectionTwo);
    });

    const recieved = await unitOfWork.atomically(
      async () => await repo.get('ben')
    );

    expect(recieved).toEqual(connectionOne);
  });

  it('can delete a token', async () => {
    const { repo, unitOfWork, userRepo, writer } = await create();
    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    const fred = User.reconstitute({
      email: 'a@b.c',
      id: 'fred',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
      await userRepo.save(fred);
    });

    const connectionOne = BankConnection.reconstitute({
      bankName: 'foo',
      id: 'foo-2',
      ownerId: 'ben',
      logo: 'bar',
      requisitionId: 'baz',
    });

    const connectionTwo = BankConnection.reconstitute({
      bankName: 'foo',
      id: 'foo-3',
      ownerId: 'fred',
      logo: 'bar',
      requisitionId: 'baz',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(connectionOne);
      await writer.save(connectionTwo);
    });

    await unitOfWork.atomically(async () => {
      await writer.delete(connectionOne);
    });

    const empty = await unitOfWork.atomically(
      async () => await repo.get('ben')
    );

    expect(empty).toEqual(undefined);
  });
};
