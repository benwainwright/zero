import type {
  IAccountRepository,
  ITransactionRepository,
} from '@zero/accounts';
import type { IUnitOfWork } from '@zero/application-core';
import type { IUserRepository } from '@zero/auth';
import { Account, Transaction, User } from '@zero/domain';

export const testTransactionRepository = (
  create: () => Promise<{
    repo: ITransactionRepository;
    userRepo: IUserRepository;
    unitOfWork: IUnitOfWork;
    accountRepo: IAccountRepository;
  }>
) => {
  describe('The transaction repository', () => {
    it('allows you to save and retrieve individual transactions', async () => {
      const { repo, unitOfWork, userRepo, accountRepo } = await create();

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

      await unitOfWork.begin();
      await userRepo.saveUser(ben);
      await accountRepo.saveAccount(barAccount);
      await accountRepo.saveAccount(bopAccount);
      await unitOfWork.commit();

      const transaction1 = Transaction.reconstitute({
        ownerId: 'ben',
        id: 'foo',
        accountId: 'bar',
        amount: 1000,
        date: new Date(),
        payee: 'foo',
      });

      const transaction2 = Transaction.reconstitute({
        ownerId: 'ben',
        id: 'biz',
        accountId: 'bop',
        amount: 100,
        date: new Date(),
        payee: 'foo',
      });

      await unitOfWork.begin();
      await repo.saveTransaction(transaction1);
      await repo.saveTransaction(transaction2);
      await unitOfWork.commit();

      await unitOfWork.begin();
      const result = await repo.getTransaction('foo');
      await unitOfWork.commit();

      expect(result).toEqual(transaction1);
    });

    it('allows you to save and retrieve transacions by account', async () => {
      const { repo, unitOfWork, userRepo, accountRepo } = await create();
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

      await unitOfWork.begin();
      await userRepo.saveUser(ben);
      await userRepo.saveUser(fred);
      await accountRepo.saveAccount(barAccount);
      await accountRepo.saveAccount(bipAccount);
      await accountRepo.saveAccount(bofAccount);
      await unitOfWork.commit();

      const fredTransaction = Transaction.reconstitute({
        id: 'blop',
        accountId: 'bip',
        payee: 'foo',
        amount: 100,
        ownerId: 'fred',
        date: new Date(),
      });

      const accountTransactions = [
        Transaction.reconstitute({
          id: 'foo',
          payee: 'foo',
          accountId: 'bar',
          amount: 1000,
          ownerId: 'ben',
          date: new Date(),
        }),

        Transaction.reconstitute({
          id: 'biz',
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
          ownerId: 'ben',
          date: new Date(),
        }),
      ];

      await unitOfWork.begin();
      await repo.saveTransactions([...accountTransactions, fredTransaction]);

      const separateAccountTransaction = Transaction.reconstitute({
        id: 'barp2',
        accountId: 'bar',
        payee: 'foo',
        ownerId: 'ben',
        amount: 100,
        date: new Date(),
      });

      await repo.saveTransaction(separateAccountTransaction);

      await repo.saveTransactions([
        Transaction.reconstitute({
          ownerId: 'ben',
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
          amount: 100,
          payee: 'foo',
          date: new Date(),
        }),
      ]);

      await unitOfWork.commit();
      await unitOfWork.begin();
      const result = await repo.getAccountTransactions('ben', 'bar', 0, 30);
      await unitOfWork.commit();
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
      const { repo, unitOfWork, userRepo, accountRepo } = await create();

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

      await unitOfWork.begin();
      await userRepo.saveUser(ben);
      await userRepo.saveUser(fred);
      await accountRepo.saveAccount(barAccount);
      await accountRepo.saveAccount(bofAccount);
      await accountRepo.saveAccount(bipAccount);
      await unitOfWork.commit();

      const accountTransactions = [
        Transaction.reconstitute({
          ownerId: 'fred',
          id: 'burpie',
          accountId: 'bip',
          amount: 100,
          payee: 'foo',
          date: new Date(),
        }),
        Transaction.reconstitute({
          id: 'foo',
          payee: 'foo',
          accountId: 'bar',
          amount: 1000,
          ownerId: 'ben',
          date: new Date(),
        }),
        Transaction.reconstitute({
          id: 'biz',
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
          date: new Date(),
          ownerId: 'ben',
        }),
      ];

      await unitOfWork.begin();
      await repo.saveTransactions(accountTransactions);

      const separateAccountTransaction = Transaction.reconstitute({
        id: 'barp2',
        accountId: 'bar',
        payee: 'foo',
        amount: 100,
        date: new Date(),
        ownerId: 'ben',
      });

      await repo.saveTransaction(separateAccountTransaction);

      await repo.saveTransactions([
        Transaction.reconstitute({
          ownerId: 'ben',
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
          amount: 100,
          payee: 'foo',
          date: new Date(),
        }),
      ]);

      await unitOfWork.commit();
      await unitOfWork.begin();
      const result = await repo.getAccountTransactionCount('ben', 'bar');
      await unitOfWork.commit();
      expect(result).toEqual(4);
    });
  });
};
