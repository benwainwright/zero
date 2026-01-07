import type { ITransactionRepository } from '@zero/accounts';
import type { IUnitOfWork } from '@zero/application-core';
import type { IUserRepository } from '@zero/auth';
import { Transaction } from '@zero/domain';

export const testTransactionRepository = (
  create: () => Promise<{
    repo: ITransactionRepository;
    userRepo: IUserRepository;
    unitOfWork: IUnitOfWork;
  }>
) => {
  describe('The transaction repository', () => {
    it('allows you to save and retrieve individual transactions', async () => {
      const { repo, unitOfWork } = await create();

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

      const result = await repo.getTransaction('foo');

      expect(result).toEqual(transaction1);
    });

    it('allows you to save and retrieve transacions by account', async () => {
      const { repo, unitOfWork } = await create();

      const fredTransaction = Transaction.reconstitute({
        id: 'bing',
        accountId: 'bar',
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
      const result = await repo.getAccountTransactions('ben', 'bar', 0, 30);
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
      const { repo, unitOfWork } = await create();

      const accountTransactions = [
        Transaction.reconstitute({
          ownerId: 'fred',
          id: 'burpie',
          accountId: 'bar',
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
      const result = await repo.getAccountTransactionCount('ben', 'bar');
      expect(result).toEqual(4);
    });
  });
};
