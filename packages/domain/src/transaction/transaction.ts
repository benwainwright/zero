import { DomainError, DomainModel, type IOwnedBy } from '@core';
import { transactionSchema, type ITransaction } from './i-transaction.ts';
import type { Category } from '@category';
import { currencySchema, type ICurrency } from './currency-schema.ts';
import type { IOpenBankingTransaction } from '@transaction';

export class Transaction
  extends DomainModel<ITransaction>
  implements ITransaction, IOwnedBy
{
  public static key = 'transaction';

  public override toObject(): ITransaction {
    return {
      id: this.id,
      currency: this.currency,
      pending: this._pending,
      accountId: this.accountId,
      ownerId: this.ownerId,
      date: this.date,
      payee: this.payee,
      amount: this.amount,
      category: this.category,
    };
  }

  public _pending: boolean;
  public get pending() {
    return this._pending;
  }

  public readonly id: string;
  public readonly ownerId: string;

  private _accountId: string;
  public get accountId() {
    return this._accountId;
  }

  private _date: Date;
  public get date() {
    return this._date;
  }

  private _currency: ICurrency;
  public get currency() {
    return this._currency;
  }

  private _amount: number;
  public get amount() {
    return this._amount;
  }

  public _payee: string;
  public get payee() {
    return this._payee;
  }

  public _category: Category | undefined;
  public get category() {
    return this._category;
  }

  private constructor(config: ITransaction) {
    super();
    this.id = config.id;
    this.ownerId = config.ownerId;
    this._amount = config.amount;
    this._payee = config.payee;
    this._accountId = config.accountId;
    this._date = config.date;
    this._pending = config.pending;
    this._currency = config.currency;
    this._category = config.category;
  }

  public delete() {
    this.raiseEvent({ event: 'TransactionDeleted', data: this });
  }

  public update(config: Partial<Omit<ITransaction, 'id' | 'ownerId'>>) {
    const old = Transaction.reconstitute(this);
    this._amount = config.amount ?? this._amount;
    this._category = config.category ?? this._category;
    this._accountId = config.accountId ?? this._accountId;
    this._date = config.date ?? this._date;
    this._payee = config.payee ?? this._payee;
    this._amount = config.amount ?? this._amount;
    this._currency = config.currency ?? this._currency;
    this._pending = config.pending ?? this._pending;
    this.raiseEvent({
      event: 'TransactionUpdated',
      data: { old, new: Transaction.reconstitute(this) },
    });
  }

  private static getConfigFromObTransaction(
    transaction: IOpenBankingTransaction,
    newTxId: string,
    pending: boolean,
    accountId: string,
    ownerId: string
  ) {
    const date = transaction.bookingDate ?? transaction.valueDate;

    if (!date) {
      throw new DomainError(`Tried to create a transaction without a date`);
    }

    const id = newTxId;
    const amount = Number.parseFloat(transaction.transactionAmount.amount);

    const creditorName =
      'creditorName' in transaction ? transaction.creditorName : undefined;
    const debtorName =
      'debtorName' in transaction ? transaction.debtorName : undefined;

    const payee =
      amount < 0 ? creditorName ?? debtorName : debtorName ?? creditorName;

    return {
      pending,
      date: new Date(date),
      id: id ?? '',
      amount,
      currency: currencySchema.parse(
        transaction.transactionAmount.currency ?? 'GBP'
      ),
      payee: payee ?? '',
      accountId,
      ownerId,
    };
  }

  public updateFromObTransaction(
    transaction: IOpenBankingTransaction,
    pending: boolean
  ) {
    this.update(
      Transaction.getConfigFromObTransaction(
        transaction,
        this.id,
        pending,
        this.accountId,
        this.ownerId
      )
    );
  }

  public static createFromObTransaction(
    transaction: IOpenBankingTransaction,
    newTxId: string,
    pending: boolean,
    accountId: string,
    ownerId: string
  ): Transaction {
    return Transaction.create(
      Transaction.getConfigFromObTransaction(
        transaction,
        newTxId,
        pending,
        accountId,
        ownerId
      )
    );
  }

  public static create(config: ITransaction) {
    const newTx = new Transaction(config);
    newTx.raiseEvent({ event: 'TransactionCreated', data: newTx });
    return newTx;
  }

  public static reconstitute(config: ITransaction) {
    return new Transaction(transactionSchema.parse(config));
  }
}
