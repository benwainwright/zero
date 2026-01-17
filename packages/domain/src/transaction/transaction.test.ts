import { Transaction } from './transaction.ts';
describe('the account model', () => {
  describe('freeze dry', () => {
    it('returns an object version of the model', () => {
      const date = new Date();
      const newTx = Transaction.reconstitute({
        payee: 'foo',
        pending: false,
        currency: 'GBP',
        ownerId: 'ben',
        id: 'foo',
        accountId: 'bar',
        amount: 1000,
        date,
      });

      const dried = newTx.toObject();
      expect(dried).toEqual({
        payee: 'foo',
        ownerId: 'ben',
        id: 'foo',
        pending: false,
        currency: 'GBP',
        accountId: 'bar',
        amount: 1000,
        date,
      });
    });
  });

  it('emits a domain event on create', () => {
    const newTx = Transaction.create({
      id: 'foo',
      accountId: 'bar',
      pending: false,
      currency: 'GBP',
      amount: 1000,
      payee: 'foo',
      date: new Date(),
      ownerId: 'ben',
    });

    expect(newTx.pullEvents()).toEqual([
      {
        event: 'TransactionCreated',
        data: newTx,
      },
    ]);
  });

  it('emits a domain event on delete', () => {
    const newTx = Transaction.reconstitute({
      pending: false,
      currency: 'GBP',
      payee: 'foo',
      ownerId: 'ben',
      id: 'foo',
      accountId: 'bar',
      amount: 1000,
      date: new Date(),
    });

    newTx.delete();

    expect(newTx.pullEvents()).toEqual([
      {
        event: 'TransactionDeleted',
        data: newTx,
      },
    ]);
  });
});
