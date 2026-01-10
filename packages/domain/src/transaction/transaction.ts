import { DomainModel, type IOwnedBy } from '@core';
import { transactionSchema, type ITransaction } from './i-transaction.ts';

export class Transaction
  extends DomainModel<ITransaction>
  implements ITransaction, IOwnedBy
{
  public override toObject(): ITransaction {
    return {
      id: this.id,
      accountId: this.accountId,
      ownerId: this.ownerId,
      date: this.date,
      payee: this.payee,
      amount: this.amount,
      categoryId: this.categoryId,
    };
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

  private _amount: number;
  public get amount() {
    return this._amount;
  }

  public _payee: string;
  public get payee() {
    return this._payee;
  }

  public _categoryId: string | undefined;
  public get categoryId() {
    return this._categoryId;
  }

  private constructor(config: ITransaction) {
    super();
    this.id = config.id;
    this.ownerId = config.ownerId;
    this._amount = config.amount;
    this._payee = config.payee;
    this._accountId = config.accountId;
    this._date = config.date;
    this._categoryId = config.categoryId;
  }

  public delete() {
    this.raiseEvent({ event: 'TransactionDeleted', data: this });
  }

  public update(config: Partial<Omit<ITransaction, 'id' | 'ownerId'>>) {
    const old = Transaction.reconstitute(this);
    this._amount = config.amount ?? this._amount;
    this._categoryId = config.categoryId ?? this._categoryId;
    this._accountId = config.accountId ?? this._accountId;
    this._date = config.date ?? this._date;
    this._payee = config.payee ?? this._payee;
    this._amount = config.amount ?? this._amount;
    this.raiseEvent({
      event: 'TransactionUpdated',
      data: { old, new: Transaction.reconstitute(this) },
    });
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
