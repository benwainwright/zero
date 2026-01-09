import { Account } from './account.ts';
describe('the account model', () => {
  describe('toObject', () => {
    it('returns an object based on the instance properties', () => {
      const newAccount = Account.reconstitute({
        ownerId: 'foo',
        id: 'id',
        name: 'account name',
        type: 'accont_type',
        closed: false,
        deleted: false,
        balance: 0,
      });

      const frozen = newAccount.toObject();

      expect(frozen).not.toBeInstanceOf(Account);
      expect(frozen).toEqual({
        id: 'id',
        ownerId: 'foo',
        name: 'account name',
        type: 'accont_type',
        closed: false,
        balance: 0,
        deleted: false,
      });
    });
  });

  it('emits a domain event on create', () => {
    const newAccount = Account.create({
      id: 'id',
      ownerId: 'foo',
      name: 'account name',
      description: 'foo',
    });

    expect(newAccount.pullEvents()).toEqual([
      {
        event: 'AccountCreated',
        data: newAccount,
      },
    ]);
  });

  it('emits a domain event on delete', () => {
    const newAccount = Account.reconstitute({
      ownerId: 'foo',
      id: 'id',
      name: 'account name',
      type: 'accont_type',
      closed: false,
      balance: 1000,
      deleted: false,
    });

    newAccount.deleteAccount();

    expect(newAccount.pullEvents()).toEqual([
      {
        event: 'AccountDeleted',
        data: Account.reconstitute({
          ownerId: 'foo',
          id: 'id',
          name: 'account name',
          type: 'accont_type',
          closed: false,
          balance: 1000,
          deleted: true,
        }),
      },
    ]);

    expect(newAccount.deleted).toEqual(true);
  });

  it('emits a domain event on update of the note', () => {
    const newAccount = Account.reconstitute({
      ownerId: 'foo',
      id: 'id',
      name: 'account name',
      type: 'accont_type',
      closed: false,
      balance: 1000,
      deleted: false,
    });

    newAccount.update({
      description: 'foobar',
    });

    expect(newAccount.pullEvents()).toEqual([
      {
        event: 'AccountUpdated',
        data: {
          old: Account.reconstitute({
            ownerId: 'foo',
            id: 'id',
            name: 'account name',
            type: 'accont_type',
            closed: false,
            balance: 1000,
            deleted: false,
          }),
          new: Account.reconstitute({
            ownerId: 'foo',
            description: 'foobar',
            id: 'id',
            name: 'account name',
            type: 'accont_type',
            closed: false,
            balance: 1000,
            deleted: false,
          }),
        },
      },
    ]);

    expect(newAccount.description).toEqual('foobar');
  });

  it('emits a domain event on update of the name', () => {
    const newAccount = Account.reconstitute({
      ownerId: 'foo',
      id: 'id',
      name: 'account name',
      type: 'accont_type',
      closed: false,
      balance: 1000,
      deleted: false,
      description: 'bar',
    });

    newAccount.update({
      name: 'foo',
    });

    expect(newAccount.pullEvents()).toEqual([
      {
        event: 'AccountUpdated',
        data: {
          old: Account.reconstitute({
            ownerId: 'foo',
            id: 'id',
            name: 'account name',
            type: 'accont_type',
            description: 'bar',
            closed: false,
            balance: 1000,
            deleted: false,
          }),
          new: Account.reconstitute({
            ownerId: 'foo',
            description: 'bar',
            id: 'id',
            name: 'foo',
            type: 'accont_type',
            closed: false,
            balance: 1000,
            deleted: false,
          }),
        },
      },
    ]);

    expect(newAccount.name).toEqual('foo');
  });

  it('emits a domain event on close', () => {
    const newAccount = Account.reconstitute({
      ownerId: 'foo',
      id: 'id',
      name: 'account name',
      type: 'accont_type',
      closed: false,
      balance: 1000,
      deleted: false,
    });

    newAccount.closeAccount();

    expect(newAccount.pullEvents()).toEqual([
      {
        event: 'AccountClosed',
        data: newAccount,
      },
    ]);

    expect(newAccount.closed).toEqual(true);
  });

  it('allows you to link an account id', () => {
    const newAccount = Account.reconstitute({
      ownerId: 'foo',
      id: 'id',
      name: 'account name',
      type: 'accont_type',
      closed: false,
      balance: 1000,
      deleted: false,
    });

    newAccount.linkAccount('foo');

    expect(newAccount.pullEvents()).toEqual([
      {
        event: 'AccountLinked',
        data: {
          old: Account.reconstitute({
            ownerId: 'foo',
            id: 'id',
            name: 'account name',
            type: 'accont_type',
            closed: false,
            balance: 1000,
            deleted: false,
          }),
          new: Account.reconstitute({
            ownerId: 'foo',
            id: 'id',
            name: 'account name',
            type: 'accont_type',
            closed: false,
            linkedOpenBankingAccount: 'foo',
            balance: 1000,
            deleted: false,
          }),
        },
      },
    ]);

    expect(newAccount.linkedOpenBankingAccount).toEqual('foo');
  });

  it('allows you to remove an a account link', () => {
    const newAccount = Account.reconstitute({
      ownerId: 'foo',
      id: 'id',
      name: 'account name',
      type: 'accont_type',
      closed: false,
      balance: 1000,
      deleted: false,
      linkedOpenBankingAccount: 'foo',
    });

    newAccount.removeAccountLink();

    expect(newAccount.pullEvents()).toEqual([
      {
        event: 'AccountLinkRemoved',
        data: {
          old: Account.reconstitute({
            ownerId: 'foo',
            id: 'id',
            name: 'account name',
            type: 'accont_type',
            closed: false,
            linkedOpenBankingAccount: 'foo',
            balance: 1000,
            deleted: false,
          }),
          new: Account.reconstitute({
            ownerId: 'foo',
            id: 'id',
            name: 'account name',
            type: 'accont_type',
            closed: false,
            linkedOpenBankingAccount: undefined,
            balance: 1000,
            deleted: false,
          }),
        },
      },
    ]);

    expect(newAccount.linkedOpenBankingAccount).toBeUndefined();
  });

  it('allows you to update the balances', () => {
    const newAccount = Account.reconstitute({
      ownerId: 'foo',
      id: 'id',
      name: 'account name',
      type: 'accont_type',
      closed: false,
      balance: 1000,
      deleted: false,
    });

    newAccount.updateBalance({
      balance: 10_000,
    });

    expect(newAccount.pullEvents()).toEqual([
      {
        event: 'AccountBalanceUpdated',
        data: {
          old: Account.reconstitute({
            ownerId: 'foo',
            id: 'id',
            name: 'account name',
            type: 'accont_type',
            closed: false,
            balance: 1000,
            deleted: false,
          }),
          new: Account.reconstitute({
            ownerId: 'foo',
            id: 'id',
            name: 'account name',
            type: 'accont_type',
            closed: false,
            balance: 10_000,
            deleted: false,
          }),
        },
      },
    ]);

    expect(newAccount.balance).toEqual(10_000);
  });
});
