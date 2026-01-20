import type { IAccountRepository } from '@zero/accounts';
import type { IUnitOfWork, IWriteRepository } from '@zero/application-core';
import { Account, User } from '@zero/domain';

export const testAccountsRepo = (
  create: () => Promise<{
    accountsRepo: IAccountRepository;
    writer: IWriteRepository<Account>;
    userRepo: IWriteRepository<User>;
    unitOfWork: IUnitOfWork;
  }>
) => {
  it('can delete accounts', async () => {
    const { accountsRepo: repo, unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => await userRepo.save(ben));

    const accountOne = Account.reconstitute({
      id: 'one',
      ownerId: 'ben',
      balance: 0,
      name: 'hello',
      type: 'checking',
      closed: false,
      deleted: false,
    });

    const accountTwo = Account.reconstitute({
      id: 'two',
      ownerId: 'ben',
      balance: 0,
      name: 'hello',
      type: 'checking',
      closed: false,
      deleted: false,
    });

    await unitOfWork.atomically(async () => {
      await writer.saveAll([accountOne, accountTwo]);
      await writer.delete(accountOne);
    });

    const result = await unitOfWork.atomically(
      async () => await repo.get('one')
    );

    expect(result).toBeUndefined();
  });

  it('allows you to bulk update categories', async () => {
    const { unitOfWork, userRepo, accountsRepo: repo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash: '',
      roles: [],
    });

    const fred = User.reconstitute({
      email: 'a@b.c',
      id: 'fred',
      passwordHash: '',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
      await userRepo.save(fred);
    });

    ben.update({
      email: 'z@b.c',
    });

    fred.update({
      email: 'h@j.c',
    });

    const first = Account.reconstitute({
      id: 'one',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const second = Account.reconstitute({
      id: 'two',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: true,
    });

    await unitOfWork.atomically(async () => {
      await writer.save(second);
      await writer.save(first);
    });

    first.update({
      name: 'baz',
    });
    second.update({ name: 'bap' });

    await unitOfWork.atomically(async () => {
      await writer.updateAll([first, second]);
    });

    const returnedFirst = await unitOfWork.atomically(async () =>
      repo.get(first.id)
    );
    expect(returnedFirst?.name).toEqual('baz');

    const returnedSecond = await unitOfWork.atomically(async () =>
      repo.get(second.id)
    );
    expect(returnedSecond?.name).toEqual('bap');
  });

  it('does not return accounts marked as deleted when getting user accounts but does return them when requested by id', async () => {
    const { accountsRepo: repo, unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => await userRepo.save(ben));

    const accountOne = Account.reconstitute({
      id: 'one',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const accountTwo = Account.reconstitute({
      id: 'two',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: true,
    });

    await unitOfWork.atomically(async () => {
      await writer.save(accountOne);
      await writer.save(accountTwo);
    });

    const accounts = await unitOfWork.atomically(
      async () => await repo.list({ start: 0, limit: 30, userId: 'ben' })
    );

    expect(accounts).toHaveLength(1);

    const account = await unitOfWork.atomically(
      async () => await repo.get('two')
    );

    expect(account).toEqual(accountTwo);
  });

  it('can save multiple accounts', async () => {
    const { accountsRepo: repo, unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
    });

    const accountOne = Account.reconstitute({
      id: 'one',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      deleted: false,
      balance: 0,
    });

    const accountTwo = Account.reconstitute({
      id: 'two',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    await unitOfWork.atomically(async () => {
      await writer.saveAll([accountOne, accountTwo]);
    });

    const accounts = await unitOfWork.atomically(
      async () => await repo.list({ start: 0, limit: 30, userId: 'ben' })
    );

    expect(accounts[0]).toEqual(accountOne);
    expect(accounts[1]).toEqual(accountTwo);
  });
  it('can update and return an account', async () => {
    const { accountsRepo: repo, unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
    });

    const accountOne = Account.reconstitute({
      id: 'one',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const accountTwo = Account.reconstitute({
      id: 'two',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    await unitOfWork.atomically(async () => {
      await writer.save(accountOne);
      await writer.save(accountTwo);
    });

    const token = await unitOfWork.atomically(
      async () => await repo.get('two')
    );

    expect(token).toEqual(accountTwo);
  });

  it('can return all of the current accounts for a user', async () => {
    const { accountsRepo: repo, unitOfWork, userRepo, writer } = await create();

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

    const accountOne = Account.reconstitute({
      id: 'one',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const accountTwo = Account.reconstitute({
      id: 'two',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      deleted: false,
      balance: 0,
    });

    const accountThree = Account.reconstitute({
      id: 'three',
      ownerId: 'fred',
      name: 'hello',
      type: 'checking',
      closed: false,
      deleted: false,
      balance: 0,
    });

    await unitOfWork.atomically(async () => {
      await writer.save(accountOne);
      await writer.save(accountTwo);
      await writer.save(accountThree);
    });

    const accounts = await unitOfWork.atomically(
      async () => await repo.list({ start: 0, limit: 30, userId: 'ben' })
    );

    expect(accounts).toHaveLength(2);
    expect(accounts[0]).toEqual(accountOne);
    expect(accounts[1]).toEqual(accountTwo);
  });
};
