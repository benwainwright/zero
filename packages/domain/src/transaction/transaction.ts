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
  public readonly accountId: string;
  public readonly date: Date;
  public readonly amount: number;
  public readonly payee: string;
  public readonly categoryId: string | undefined;

  private constructor(config: ITransaction) {
    super();
    this.id = config.id;
    this.ownerId = config.ownerId;
    this.amount = config.amount;
    this.payee = config.payee;
    this.accountId = config.accountId;
    this.date = config.date;
    this.categoryId = config.categoryId;
  }

  public delete() {
    this.raiseEvent({ event: 'TransactionDeleted', data: this });
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
