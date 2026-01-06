import { DomainModel, type IOwnedBy } from '@core';
import { accountSchema, type IAccount } from './i-account.ts';

export class Account
  extends DomainModel<IAccount>
  implements IAccount, IOwnedBy
{
  public readonly id: string;

  public static key = 'account';

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
    this.name = config.name;
    this.type = config.type;
    this.closed = config.closed;
    this.deleted = config.deleted;
    this.ownerId = config.ownerId;
    this._balance = config.balance;
    this._linkedOpenBankingAccount = config.linkedOpenBankingAccount;
  }
  public readonly ownerId: string;

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
      ownerId: this.ownerId,
      balance: this._balance,
      id: this.id,
      name: this.name,
      type: this.type,
      closed: this.closed,
      deleted: this.deleted,
    };
  }

  public static reconstitute(config: IAccount) {
    return new Account(accountSchema.parse(config));
  }

  public static create(config: IAccount) {
    const theAccount = new Account(config);
    theAccount.raiseEvent({ event: 'AccountCreated', data: theAccount });
    return theAccount;
  }
}
