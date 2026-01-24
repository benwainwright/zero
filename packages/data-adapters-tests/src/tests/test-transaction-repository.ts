import type { ITransactionRepository } from '@zero/accounts';
import type { IUnitOfWork, IWriteRepository } from '@zero/application-core';
import { Account, Category, Transaction, User } from '@zero/domain';

export const testTransactionRepository = (
  create: () => Promise<{
    repo: ITransactionRepository;
    writer: IWriteRepository<Transaction>;
    userRepo: IWriteRepository<User>;
    categories: IWriteRepository<Category>;
    unitOfWork: IUnitOfWork;
    accountRepo: IWriteRepository<Account>;
  }>
) => {
  it('allows you to check the existence of keys', async () => {
    const { repo, unitOfWork, userRepo, accountRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });
    const barAccount = Account.reconstitute({
      id: 'bar',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const bopAccount = Account.reconstitute({
      id: 'bop',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
      await accountRepo.save(barAccount);
      await accountRepo.save(bopAccount);
    });

    const transaction1 = Transaction.reconstitute({
      ownerId: 'ben',
      id: 'foo',
      accountId: 'bar',
      amount: 1000,
      date: new Date(),
      payee: 'foo',
      pending: true,
      currency: 'GBP',
    });

    const transaction2 = Transaction.reconstitute({
      pending: true,
      currency: 'GBP',
      ownerId: 'ben',
      id: 'biz',
      accountId: 'bop',
      amount: 100,
      date: new Date(),
      payee: 'foo',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(transaction1);
      await writer.save(transaction2);
    });

    const first = await unitOfWork.atomically(async () => {
      return await repo.exists('foo');
    });

    expect(first).toEqual(true);

    const second = await unitOfWork.atomically(async () => {
      return await repo.exists('superman');
    });

    expect(second).toEqual(false);
  });

  it('allows you to bulk fetch items by id', async () => {
    const { repo, unitOfWork, userRepo, accountRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });
    const barAccount = Account.reconstitute({
      id: 'bar',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const bopAccount = Account.reconstitute({
      id: 'bop',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
      await accountRepo.save(barAccount);
      await accountRepo.save(bopAccount);
    });

    const transaction1 = Transaction.reconstitute({
      ownerId: 'ben',
      id: 'foo',
      accountId: 'bar',
      amount: 1000,
      date: new Date(),
      payee: 'foo',
      pending: true,
      currency: 'GBP',
    });

    const transaction2 = Transaction.reconstitute({
      pending: true,
      currency: 'GBP',
      ownerId: 'ben',
      id: 'biz',
      accountId: 'bop',
      amount: 100,
      date: new Date(),
      payee: 'foo',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(transaction1);
      await writer.save(transaction2);
    });

    const result = await unitOfWork.atomically(async () => {
      return await repo.getMany(['foo', 'biz', 'superman']);
    });

    expect(result).toEqual(
      expect.arrayContaining([transaction1, transaction2])
    );
  });

  it('allows you to bulk check the existence of keys', async () => {
    const { repo, unitOfWork, userRepo, accountRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });
    const barAccount = Account.reconstitute({
      id: 'bar',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const bopAccount = Account.reconstitute({
      id: 'bop',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
      await accountRepo.save(barAccount);
      await accountRepo.save(bopAccount);
    });

    const transaction1 = Transaction.reconstitute({
      ownerId: 'ben',
      id: 'foo',
      accountId: 'bar',
      amount: 1000,
      date: new Date(),
      payee: 'foo',
      pending: true,
      currency: 'GBP',
    });

    const transaction2 = Transaction.reconstitute({
      pending: true,
      currency: 'GBP',
      ownerId: 'ben',
      id: 'biz',
      accountId: 'bop',
      amount: 100,
      date: new Date(),
      payee: 'foo',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(transaction1);
      await writer.save(transaction2);
    });

    const result = await unitOfWork.atomically(async () => {
      return await repo.existsAll(['superman', 'foo']);
    });

    expect(result).toEqual([
      { id: 'superman', exists: false },
      { id: 'foo', exists: true },
    ]);
  });

  it('allows you to bulk update transactions', async () => {
    const { repo, unitOfWork, userRepo, accountRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });
    const barAccount = Account.reconstitute({
      id: 'bar',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const bopAccount = Account.reconstitute({
      id: 'bop',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
      await accountRepo.save(barAccount);
      await accountRepo.save(bopAccount);
    });

    const transaction1 = Transaction.reconstitute({
      ownerId: 'ben',
      id: 'foo',
      accountId: 'bar',
      amount: 1000,
      date: new Date(),
      payee: 'foo',
      pending: true,
      currency: 'GBP',
    });

    const transaction2 = Transaction.reconstitute({
      pending: true,
      currency: 'GBP',
      ownerId: 'ben',
      id: 'biz',
      accountId: 'bop',
      amount: 100,
      date: new Date(),
      payee: 'foo',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(transaction1);
      await writer.save(transaction2);
    });

    transaction1.update({
      currency: 'USD',
    });

    transaction2.update({
      amount: 100,
    });

    await unitOfWork.atomically(async () => {
      await writer.updateAll([transaction1, transaction2]);
    });

    const returned1 = await unitOfWork.atomically(
      async () => await repo.get(transaction1.id)
    );
    expect(returned1?.currency).toEqual('USD');

    const returned2 = await unitOfWork.atomically(
      async () => await repo.get(transaction2.id)
    );
    expect(returned2?.amount).toEqual(100);
  });

  it('allows you to save and retrieve individual transactions', async () => {
    const { repo, unitOfWork, userRepo, accountRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });
    const barAccount = Account.reconstitute({
      id: 'bar',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const bopAccount = Account.reconstitute({
      id: 'bop',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
      await accountRepo.save(barAccount);
      await accountRepo.save(bopAccount);
    });

    const transaction1 = Transaction.reconstitute({
      ownerId: 'ben',
      id: 'foo',
      accountId: 'bar',
      amount: 1000,
      date: new Date(),
      payee: 'foo',
      pending: true,
      currency: 'GBP',
    });

    const transaction2 = Transaction.reconstitute({
      pending: true,
      currency: 'GBP',
      ownerId: 'ben',
      id: 'biz',
      accountId: 'bop',
      amount: 100,
      date: new Date(),
      payee: 'foo',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(transaction1);
      await writer.save(transaction2);
    });

    const result = await unitOfWork.atomically(async () => {
      return await repo.get('foo');
    });

    expect(result).toEqual(transaction1);
  });

  it('correctly rehydrates categories', async () => {
    const { repo, unitOfWork, userRepo, accountRepo, writer, categories } =
      await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    const first = Category.reconstitute({
      id: 'baz',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });
    const second = Category.reconstitute({
      id: 'bip',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });

    const barAccount = Account.reconstitute({
      id: 'bar',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const bopAccount = Account.reconstitute({
      id: 'bop',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
      await accountRepo.save(barAccount);
      await accountRepo.save(bopAccount);
      await categories.saveAll([first, second]);
    });

    const transaction1 = Transaction.reconstitute({
      pending: true,
      currency: 'GBP',
      ownerId: 'ben',
      id: 'foo',
      accountId: 'bar',
      amount: 1000,
      date: new Date(),
      category: first,
      payee: 'foo',
    });

    const transaction2 = Transaction.reconstitute({
      ownerId: 'ben',
      pending: true,
      currency: 'GBP',
      id: 'biz',
      accountId: 'bop',
      amount: 100,
      date: new Date(),
      payee: 'foo',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(transaction1);
      await writer.save(transaction2);
    });

    const result = await unitOfWork.atomically(async () => {
      return await repo.get('foo');
    });

    expect(result?.category).toEqual(first);
  });

  it('allows you to save and retrieve transacions by account', async () => {
    const { repo, unitOfWork, userRepo, accountRepo, writer } = await create();
    const barAccount = Account.reconstitute({
      id: 'bar',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const bofAccount = Account.reconstitute({
      id: 'bof',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const bipAccount = Account.reconstitute({
      id: 'bip',
      ownerId: 'fred',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

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
      await accountRepo.save(barAccount);
      await accountRepo.save(bipAccount);
      await accountRepo.save(bofAccount);
    });

    const fredTransaction = Transaction.reconstitute({
      id: 'blop',
      pending: true,
      currency: 'GBP',
      accountId: 'bip',
      payee: 'foo',
      amount: 100,
      ownerId: 'fred',
      date: new Date(),
    });

    const accountTransactions = [
      Transaction.reconstitute({
        pending: true,
        currency: 'GBP',
        id: 'foo',
        payee: 'foo',
        accountId: 'bar',
        amount: 1000,
        ownerId: 'ben',
        date: new Date(),
      }),

      Transaction.reconstitute({
        id: 'biz',
        pending: false,
        currency: 'GBP',
        payee: 'foo',
        accountId: 'bar',
        amount: 100,
        date: new Date(),
        ownerId: 'ben',
      }),

      Transaction.reconstitute({
        id: 'bing',
        accountId: 'bar',
        payee: 'foo',
        amount: 100,
        pending: false,
        currency: 'GBP',
        ownerId: 'ben',
        date: new Date(),
      }),
    ];

    const separateAccountTransaction = Transaction.reconstitute({
      id: 'barp2',
      accountId: 'bar',
      pending: false,
      currency: 'GBP',
      payee: 'foo',
      ownerId: 'ben',
      amount: 100,
      date: new Date(),
    });

    await unitOfWork.atomically(async () => {
      await writer.saveAll([...accountTransactions, fredTransaction]);

      await writer.save(separateAccountTransaction);

      await writer.saveAll([
        Transaction.reconstitute({
          ownerId: 'ben',
          currency: 'GBP',
          pending: true,
          id: 'barp',
          accountId: 'bof',
          amount: 100,
          payee: 'foo',
          date: new Date(),
        }),

        Transaction.reconstitute({
          ownerId: 'ben',
          id: 'burpie',
          accountId: 'bof',
          currency: 'GBP',
          pending: true,
          amount: 100,
          payee: 'foo',
          date: new Date(),
        }),
      ]);
    });
    const result = await unitOfWork.atomically(async () => {
      return await repo.list({
        start: 0,
        limit: 30,
        accountId: 'bar',
        userId: 'ben',
      });
    });
    expect(result).toHaveLength(4);

    expect(result).toEqual(
      expect.arrayContaining([
        ...accountTransactions,
        separateAccountTransaction,
      ])
    );

    expect(result).not.toEqual(expect.arrayContaining([fredTransaction]));
  });

  it('allows you to retrieve a total count of txs in a given account', async () => {
    const { repo, unitOfWork, userRepo, accountRepo, writer } = await create();

    const barAccount = Account.reconstitute({
      id: 'bar',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const bofAccount = Account.reconstitute({
      id: 'bof',
      ownerId: 'ben',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

    const bipAccount = Account.reconstitute({
      id: 'bip',
      ownerId: 'fred',
      name: 'hello',
      type: 'checking',
      closed: false,
      balance: 0,
      deleted: false,
    });

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
      await accountRepo.save(barAccount);
      await accountRepo.save(bofAccount);
      await accountRepo.save(bipAccount);
    });

    const accountTransactions = [
      Transaction.reconstitute({
        ownerId: 'fred',
        currency: 'GBP',
        pending: true,
        id: 'burpie',
        accountId: 'bip',
        amount: 100,
        payee: 'foo',
        date: new Date(),
      }),
      Transaction.reconstitute({
        id: 'foo',
        currency: 'GBP',
        pending: true,
        payee: 'foo',
        accountId: 'bar',
        amount: 1000,
        ownerId: 'ben',
        date: new Date(),
      }),
      Transaction.reconstitute({
        id: 'biz',
        payee: 'foo',
        currency: 'GBP',
        pending: true,
        accountId: 'bar',
        amount: 100,
        date: new Date(),
        ownerId: 'ben',
      }),
      Transaction.reconstitute({
        id: 'bing',
        accountId: 'bar',
        payee: 'foo',
        currency: 'GBP',
        pending: true,
        amount: 100,
        date: new Date(),
        ownerId: 'ben',
      }),
    ];

    await unitOfWork.atomically(async () => {
      await writer.saveAll(accountTransactions);

      const separateAccountTransaction = Transaction.reconstitute({
        id: 'barp2',
        currency: 'GBP',
        pending: true,
        accountId: 'bar',
        payee: 'foo',
        amount: 100,
        date: new Date(),
        ownerId: 'ben',
      });

      await writer.save(separateAccountTransaction);

      await writer.saveAll([
        Transaction.reconstitute({
          currency: 'GBP',
          pending: true,
          ownerId: 'ben',
          id: 'barp',
          accountId: 'bof',
          amount: 100,
          payee: 'foo',
          date: new Date(),
        }),

        Transaction.reconstitute({
          currency: 'GBP',
          pending: true,
          ownerId: 'ben',
          id: 'burpie-2',
          accountId: 'bof',
          amount: 100,
          payee: 'foo',
          date: new Date(),
        }),
      ]);
    });
    const result = await unitOfWork.atomically(async () => {
      return await repo.count({ userId: 'ben', accountId: 'bar' });
    });

    expect(result).toEqual(4);
  });
};
