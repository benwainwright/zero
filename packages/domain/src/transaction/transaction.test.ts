import { Transaction } from './transaction.ts';
import { describe, it, expect } from 'vitest';
import type { IOpenBankingTransaction } from '@transaction';
describe('the transaction model', () => {
  const isoDate = (d: Date) => d.toISOString().slice(0, 10);

  const makeCreditTx = (
    overrides: Partial<IOpenBankingTransaction> = {}
  ): IOpenBankingTransaction => ({
    creditorName: 'Creditor Ltd',
    transactionId: 'ob_tx_1',
    bookingDate: '2026-01-10',
    valueDate: '2026-01-11',
    transactionAmount: { currency: 'GBP', amount: '-10.50' },
    ...overrides,
  });

  const makeDebitTx = (
    overrides: Partial<IOpenBankingTransaction> = {}
  ): IOpenBankingTransaction => ({
    debtorName: 'Debtor Ltd',
    transactionId: 'ob_tx_1',
    bookingDate: '2026-01-10',
    valueDate: '2026-01-11',
    transactionAmount: { currency: 'EUR', amount: '2500.00' },
    ...overrides,
  });

  const makeExistingTx = () =>
    Transaction.reconstitute({
      id: 'tx_local_1',
      ownerId: 'owner_1',
      accountId: 'account_1',
      pending: false,
      payee: 'Initial Payee',
      amount: 1,
      currency: 'GBP',
      date: new Date('2026-01-01'),
    });

  describe('updateFromObTransaction', () => {
    it('does not change id, ownerId, or accountId', () => {
      const tx = makeExistingTx();
      const ob = makeCreditTx({
        transactionId: 'ob_tx_different',
        creditorName: 'Netflix',
        transactionAmount: { currency: 'USD', amount: '-12.34' },
        bookingDate: '2026-01-05',
      });

      tx.updateFromObTransaction(ob, true);

      expect(tx.id).toBe('tx_local_1');
      expect(tx.ownerId).toBe('owner_1');
      expect(tx.accountId).toBe('account_1');
    });

    it('updates pending from the argument', () => {
      const tx = makeExistingTx();
      const ob = makeCreditTx();

      tx.updateFromObTransaction(ob, true);
      expect(tx.pending).toBe(true);

      tx.updateFromObTransaction(ob, false);
      expect(tx.pending).toBe(false);
    });

    it('uses bookingDate when present (even if valueDate is also present)', () => {
      const tx = makeExistingTx();
      const ob = makeCreditTx({
        bookingDate: '2026-01-05',
        valueDate: '2026-01-20',
      });

      tx.updateFromObTransaction(ob, false);

      expect(isoDate(tx.date)).toBe('2026-01-05');
    });

    it('uses valueDate when bookingDate is missing', () => {
      const tx = makeExistingTx();
      const ob = makeCreditTx({
        bookingDate: undefined,
        valueDate: '2026-01-20',
      });

      tx.updateFromObTransaction(ob, false);

      expect(isoDate(tx.date)).toBe('2026-01-20');
    });

    it('throws if neither bookingDate nor valueDate exists', () => {
      const tx = makeExistingTx();
      const ob = makeCreditTx({ bookingDate: undefined, valueDate: undefined });

      expect(() => tx.updateFromObTransaction(ob, false)).toThrow(
        /date|bookingDate|valueDate/i
      );
    });

    it('parses amount string into number and preserves sign', () => {
      const tx = makeExistingTx();
      const ob = makeCreditTx({
        transactionAmount: { currency: 'USD', amount: '-123.45' },
        creditorName: 'Some Payee',
      });

      tx.updateFromObTransaction(ob, false);

      expect(tx.amount).toBe(-123.45);
      expect(tx.currency).toBe('USD');
    });

    describe('payee derivation', () => {
      it('amount < 0 → prefers creditorName, falls back to debtorName', () => {
        const tx1 = makeExistingTx();
        const ob1 = makeCreditTx({
          transactionAmount: { currency: 'GBP', amount: '-10.00' },
          creditorName: 'Netflix',
        });

        tx1.updateFromObTransaction(ob1, false);
        expect(tx1.payee).toBe('Netflix');

        const tx2 = makeExistingTx();
        const ob2 = makeDebitTx({
          transactionAmount: { currency: 'GBP', amount: '-10.00' },
          debtorName: 'Example Bank PLC',
        });

        tx2.updateFromObTransaction(ob2, false);
        expect(tx2.payee).toBe('Example Bank PLC');
      });

      it('amount < 0 and both names exist → chooses creditorName', () => {
        const tx = makeExistingTx();
        const ob = makeCreditTx({
          transactionAmount: { currency: 'GBP', amount: '-10.00' },
          creditorName: 'British Gas',
          debtorName: 'Should not be chosen',
        });

        tx.updateFromObTransaction(ob, false);
        expect(tx.payee).toBe('British Gas');
      });

      it('amount > 0 → prefers debtorName, falls back to creditorName', () => {
        const tx1 = makeExistingTx();
        const ob1 = makeDebitTx({
          transactionAmount: { currency: 'EUR', amount: '2500.00' },
          debtorName: 'ACME Corp Ltd',
        });

        tx1.updateFromObTransaction(ob1, false);
        expect(tx1.payee).toBe('ACME Corp Ltd');

        const tx2 = makeExistingTx();
        const ob2 = makeCreditTx({
          transactionAmount: { currency: 'GBP', amount: '19.99' },
          creditorName: 'Amazon EU SARL',
        });

        tx2.updateFromObTransaction(ob2, false);
        expect(tx2.payee).toBe('Amazon EU SARL');
      });

      it('amount > 0 and both names exist → chooses debtorName', () => {
        const tx = makeExistingTx();
        const ob = makeDebitTx({
          transactionAmount: { currency: 'EUR', amount: '120.00' },
          debtorName: 'Employer Ltd',
          creditorName: 'Should not be chosen',
        });

        tx.updateFromObTransaction(ob, false);
        expect(tx.payee).toBe('Employer Ltd');
      });
    });
  });

  describe('Transaction.createFromObTransaction', () => {
    it('uses bookingDate when present (even if valueDate is also present)', () => {
      const ob = makeCreditTx({
        bookingDate: '2026-01-05',
        valueDate: '2026-01-20',
      });

      const tx = Transaction.createFromObTransaction(
        ob,
        'foo',
        false,
        'foo',
        'bar'
      );

      expect(isoDate(tx.date)).toBe('2026-01-05');
    });

    it('sets the id directly', () => {
      const ob = makeCreditTx({
        bookingDate: '2026-01-05',
        valueDate: '2026-01-20',
      });

      const tx = Transaction.createFromObTransaction(
        ob,
        'foo',
        false,
        'foo',
        'bar'
      );

      expect(tx.id).toEqual('foo');
    });

    it('uses valueDate when bookingDate is missing', () => {
      const ob = makeCreditTx({
        bookingDate: undefined,
        valueDate: '2026-01-20',
      });

      const tx = Transaction.createFromObTransaction(
        ob,
        'foo',
        true,
        'foo',
        'bar'
      );

      expect(isoDate(tx.date)).toBe('2026-01-20');
    });

    it('throws if neither bookingDate nor valueDate exists', () => {
      const ob = makeCreditTx({ bookingDate: undefined, valueDate: undefined });

      expect(() =>
        Transaction.createFromObTransaction(ob, 'foo', false, 'foo', 'bar')
      ).toThrow(/date|bookingDate|valueDate/i);
    });

    it('sets pending exclusively from the second argument', () => {
      const ob = makeCreditTx();

      expect(
        Transaction.createFromObTransaction(ob, 'foo', true, 'foo', 'bar')
          .pending
      ).toBe(true);
      expect(
        Transaction.createFromObTransaction(ob, 'foo', false, 'foo', 'bar')
          .pending
      ).toBe(false);
    });

    it('maps id from transactionId', () => {
      const ob = makeCreditTx({ transactionId: 'foo-bar' });

      const result = Transaction.createFromObTransaction(
        ob,
        'foo',
        true,
        'foo',
        'bar'
      );
      expect(result.id).toEqual('foo-bar');
    });

    it('parses amount string into number and preserves sign', () => {
      const ob = makeCreditTx({
        transactionAmount: { currency: 'USD', amount: '-123.45' },
      });

      const tx = Transaction.createFromObTransaction(
        ob,
        'foo',
        false,
        'foo',
        'bar'
      );

      expect(tx.amount).toBe(-123.45);
      expect(tx.currency).toBe('USD');
    });

    describe('payee derivation', () => {
      it('amount < 0 → prefers creditorName, falls back to debtorName', () => {
        const ob1 = makeCreditTx({
          transactionAmount: { currency: 'GBP', amount: '-10.00' },
          creditorName: 'Netflix',
        });
        expect(
          Transaction.createFromObTransaction(ob1, 'foo', false, 'foo', 'bar')
            .payee
        ).toBe('Netflix');

        const ob2 = makeDebitTx({
          transactionAmount: { currency: 'GBP', amount: '-10.00' },
          debtorName: 'Example Bank PLC',
        });
        expect(
          Transaction.createFromObTransaction(ob2, 'foo', false, 'foo', 'bar')
            .payee
        ).toBe('Example Bank PLC');
      });

      it('amount < 0 and both names exist → chooses creditorName', () => {
        const ob = makeCreditTx({
          transactionAmount: { currency: 'GBP', amount: '-10.00' },
          creditorName: 'British Gas',
          debtorName: 'Should not be chosen',
        });

        expect(
          Transaction.createFromObTransaction(ob, 'foo', false, 'foo', 'bar')
            .payee
        ).toBe('British Gas');
      });

      it('amount > 0 → prefers debtorName, falls back to creditorName', () => {
        const ob1 = makeDebitTx({
          transactionAmount: { currency: 'EUR', amount: '2500.00' },
          debtorName: 'ACME Corp Ltd',
        });
        expect(
          Transaction.createFromObTransaction(ob1, 'foo', false, 'foo', 'bar')
            .payee
        ).toBe('ACME Corp Ltd');

        const ob2 = makeCreditTx({
          transactionAmount: { currency: 'GBP', amount: '19.99' },
          creditorName: 'Amazon EU SARL',
        });
        expect(
          Transaction.createFromObTransaction(ob2, 'foo', false, 'foo', 'bar')
            .payee
        ).toBe('Amazon EU SARL');
      });

      it('amount > 0 and both names exist → chooses debtorName', () => {
        const ob = makeDebitTx({
          transactionAmount: { currency: 'EUR', amount: '120.00' },
          debtorName: 'Employer Ltd',
          creditorName: 'Should not be chosen',
        });

        expect(
          Transaction.createFromObTransaction(ob, 'foo', false, 'foo', 'bar')
            .payee
        ).toBe('Employer Ltd');
      });
    });
  });

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
