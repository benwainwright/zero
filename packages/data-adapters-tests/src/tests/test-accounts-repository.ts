import type { IAccountRepository } from '@zero/accounts';
import type { IUnitOfWork } from '@zero/application-core';
import { Account } from '@zero/domain';

export const testAccountsRepo = (
  create: () => Promise<{
    repo: IAccountRepository;
    unitOfWork: IUnitOfWork;
  }>
) => {
  describe('the account repository', () => {
    it('can delete accounts', async () => {
      const { repo } = await create();

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

      await repo.saveAccounts([accountOne, accountTwo]);

      await repo.deleteAccount(accountOne);

      const result = await repo.getAccounts('one');

      expect(result).toBeUndefined();
    });

    it('can save multiple users', async () => {
      const { repo } = await create();

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

      await repo.saveAccounts([accountOne, accountTwo]);

      const accounts = await repo.getUserAccounts('ben');

      expect(accounts[0]).toEqual(accountOne);
      expect(accounts[1]).toEqual(accountTwo);
    });
    it('can update and return an account', async () => {
      const { repo } = await create();

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

      await repo.saveAccount(accountOne);
      await repo.saveAccount(accountTwo);

      const token = await repo.getAccounts('two');

      expect(token).toEqual(accountTwo);
    });

    it('can return all of the current accounts for a user', async () => {
      const { repo } = await create();

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

      await repo.saveAccount(accountOne);
      await repo.saveAccount(accountTwo);
      await repo.saveAccount(accountThree);

      const accounts = await repo.getUserAccounts('ben');

      expect(accounts).toHaveLength(2);
      expect(accounts[0]).toEqual(accountOne);
      expect(accounts[1]).toEqual(accountTwo);
    });
  });
};
