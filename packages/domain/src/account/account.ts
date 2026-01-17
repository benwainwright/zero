import { DomainModel, type IOwnedBy } from '@core';
import { accountSchema, type IAccount } from './i-account.ts';

export class Account
  extends DomainModel<IAccount>
  implements IAccount, IOwnedBy
{
  public readonly id: string;

  public static key = 'account';

  private _name: string;
  private _closed: boolean;
  private _description: string | undefined;
  public readonly type: string;
  private _deleted: boolean;
  private _balance: number;
  private _linkedOpenBankingAccount: string | undefined;

  private constructor(config: IAccount) {
    super();
    this.id = config.id;
    this._name = config.name;
    this.type = config.type;
    this._closed = config.closed;
    this._deleted = config.deleted;
    this.ownerId = config.ownerId;
    this._balance = config.balance;
    this._description = config.description;
    this._linkedOpenBankingAccount = config.linkedOpenBankingAccount;
  }

  public readonly ownerId: string;

  public get name() {
    return this._name;
  }

  public get description() {
    return this._description;
  }

  public deleteAccount() {
    this._deleted = true;
    this.raiseEvent({
      event: 'AccountDeleted',
      data: Account.reconstitute(this.toObject()),
    });
  }

  public closeAccount() {
    this._closed = true;
    this.raiseEvent({
      event: 'AccountClosed',
      data: Account.reconstitute(this.toObject()),
    });
  }

  public get linkedOpenBankingAccount() {
    return this._linkedOpenBankingAccount;
  }

  public update(config: { description?: string; name?: string }) {
    const old = Account.reconstitute(this);
    this._name = config.name ?? this._name;
    this._description = config.description ?? this._description;
    this.raiseEvent({
      event: 'AccountUpdated',
      data: { old, new: Account.reconstitute(this) },
    });
  }

  public get deleted() {
    return this._deleted;
  }

  public get closed() {
    return this._closed;
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
      name: this._name,
      linkedOpenBankingAccount: this._linkedOpenBankingAccount,
      type: this.type,
      description: this._description,
      closed: this._closed,
      deleted: this._deleted,
    };
  }

  public static reconstitute(config: IAccount) {
    return new Account(accountSchema.parse(config));
  }

  public static create(config: {
    id: string;
    name: string;
    ownerId: string;
    description: string;
  }) {
    const theAccount = new Account({
      ...config,
      type: 'current',
      closed: false,
      deleted: false,
      balance: 0,
    });
    theAccount.raiseEvent({ event: 'AccountCreated', data: theAccount });
    return theAccount;
  }
}
