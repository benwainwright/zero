import { DomainModel } from '@core';
import { accountSchema, type IAccount } from './i-account.ts';

export class Account extends DomainModel<IAccount> implements IAccount {
  public readonly id: string;

  public readonly userId: string;
  public readonly name: string;
  public readonly closed: boolean;
  public readonly note: string | undefined;
  public readonly type: string;
  public readonly deleted: boolean;
  private _balance: number;
  private _linkedOpenBankingAccount: string | undefined;

  private constructor(config: IAccount) {
    super();
    this.id = config.id;
    this.userId = config.userId;
    this.name = config.name;
    this.type = config.type;
    this.closed = config.closed;
    this.note = config.note;
    this.deleted = config.deleted;
    this._balance = config.balance;
    this._linkedOpenBankingAccount = config.linkedOpenBankingAccount;
  }

  public delete() {
    this.raiseEvent({ event: 'AccountDeleted', data: this });
  }

  public get linkedOpenBankingAccount() {
    return this._linkedOpenBankingAccount;
  }

  public linkAccount(id: string) {
    const old = Account.reconstitute(this);
    this._linkedOpenBankingAccount = id;
    this.raiseEvent({
      event: 'AccountLinked',
      data: { old, new: Account.reconstitute(this) },
    });
  }

  public removeAccountLink() {
    const old = Account.reconstitute(this);
    this._linkedOpenBankingAccount = undefined;
    this.raiseEvent({
      event: 'AccountLinkRemoved',
      data: { old, new: Account.reconstitute(this) },
    });
  }

  public updateBalance(config: { balance: number }) {
    const old = Account.reconstitute(this);
    this._balance = config.balance;

    this.raiseEvent({
      event: 'AccountBalanceUpdated',
      data: { old, new: Account.reconstitute(this) },
    });
  }

  public get balance() {
    return this._balance;
  }

  public override toObject(): IAccount {
    return {
      balance: this._balance,
      id: this.id,
      userId: this.userId,
      name: this.name,
      type: this.type,
      closed: this.closed,
      deleted: this.deleted,
      note: this.note,
    };
  }

  public static reconstitute(
    config: Omit<IAccount, 'note'> & { note?: string | undefined | null }
  ) {
    return new Account(accountSchema.parse(config));
  }

  public static create(config: IAccount) {
    const theAccount = new Account(config);
    theAccount.raiseEvent({ event: 'AccountCreated', data: theAccount });
    return theAccount;
  }
}
