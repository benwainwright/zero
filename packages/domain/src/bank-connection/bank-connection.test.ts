import { BankConnection } from './bank-connection.ts';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('the bank connection', () => {
  describe('delete', () => {
    it('emits a delete event', () => {
      const connection = BankConnection.reconstitute({
        bankName: 'foo',
        id: 'foo',
        ownerId: 'ben',
        logo: 'bar',
        requisitionId: 'baz',
      });

      connection.delete();

      expect(connection.pullEvents()).toEqual([
        {
          event: 'BankConnectionDeleted',
          data: connection,
        },
      ]);
    });
  });

  describe('reconstitute', () => {
    it('creates a hydrated bank connection without emitting any events', () => {
      const connection = BankConnection.reconstitute({
        bankName: 'foo',
        id: 'foo',
        ownerId: 'ben',
        logo: 'bar',
        requisitionId: 'baz',
      });

      expect(connection.bankName).toEqual('foo');
      expect(connection.logo).toEqual('bar');
      expect(connection.toObject().requisitionId).toEqual('baz');
      expect(connection.pullEvents()).toEqual([]);
    });
  });

  describe('create', () => {
    it('creates a bank connection and emits an event', () => {
      const connection = BankConnection.create({
        id: 'foo',
        ownerId: 'ben',
        bankName: 'foo',
        logo: 'bar',
      });

      expect(connection.bankName).toEqual('foo');
      expect(connection.logo).toEqual('bar');
      expect(connection.toObject().requisitionId).toEqual(undefined);

      expect(connection.pullEvents()).toEqual([
        {
          event: 'BankConnectionCreated',
          data: connection,
        },
      ]);
    });
  });

  describe('save account ids', () => {
    it('saves the account id and raises the correct event', () => {
      const connection = BankConnection.reconstitute({
        id: 'foo',
        ownerId: 'ben',
        bankName: 'foo',
        logo: 'bar',
      });

      connection.saveAccounts(['foo', 'bar']);

      expect(connection.toObject().accounts).toEqual(['foo', 'bar']);

      expect(connection.pullEvents()).toEqual([
        {
          event: 'BankAccountIdsSaved',
          data: {
            old: BankConnection.reconstitute({
              id: 'foo',
              ownerId: 'ben',
              bankName: 'foo',
              logo: 'bar',
            }),
            new: BankConnection.reconstitute({
              id: 'foo',
              ownerId: 'ben',
              bankName: 'foo',
              accounts: ['foo', 'bar'],
              logo: 'bar',
            }),
          },
        },
      ]);
    });
  });

  describe('save requisition id', () => {
    it('saves the req id and raises the correct event', () => {
      const connection = BankConnection.reconstitute({
        id: 'foo',
        ownerId: 'ben',
        bankName: 'foo',
        logo: 'bar',
      });

      connection.saveRequisitionId('foo');

      expect(connection.toObject().requisitionId).toEqual('foo');

      expect(connection.pullEvents()).toEqual([
        {
          event: 'BankConnectionRequisitionSaved',
          data: {
            old: BankConnection.reconstitute({
              id: 'foo',
              ownerId: 'ben',
              bankName: 'foo',
              logo: 'bar',
            }),
            new: BankConnection.reconstitute({
              id: 'foo',
              ownerId: 'ben',
              bankName: 'foo',
              requisitionId: 'foo',
              logo: 'bar',
            }),
          },
        },
      ]);
    });
  });
});
