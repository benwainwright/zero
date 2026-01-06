import { DomainModel, type IOwnedBy } from '@core';
import type { IBankConnection } from './i-bank-connection.ts';

export class BankConnection
  extends DomainModel<IBankConnection>
  implements IBankConnection, IOwnedBy
{
  public static key = 'bank-connection';
  public readonly id: string;
  public readonly ownerId: string;
  public readonly bankName: string;
  public readonly logo: string;
  private _requisitionId: string | undefined;
  private _accounts: string[] | undefined;

  public constructor(config: IBankConnection) {
    super();
    this.id = config.id;
    this.ownerId = config.ownerId;
    this.bankName = config.bankName;
    this.logo = config.logo;
    this._requisitionId = config.requisitionId;
    this._accounts = config.accounts;
  }

  public override toObject(): IBankConnection {
    return {
      id: this.id,
      ownerId: this.ownerId,
      logo: this.logo,
      bankName: this.bankName,
      requisitionId: this._requisitionId,
      accounts: this._accounts,
    };
  }

  public static create(config: Omit<IBankConnection, 'requisitionId'>) {
    const connection = new BankConnection(config);

    connection.raiseEvent({
      event: 'BankConnectionCreated',
      data: connection,
    });

    return connection;
  }

  public saveAccounts(ids: string[]) {
    const old = BankConnection.reconstitute(this.toObject());
    this._accounts = ids;
    this.raiseEvent({
      event: 'BankAccountIdsSaved',
      data: { old, new: this },
    });
  }

  public get accounts() {
    return this._accounts;
  }

  public get requisitionId() {
    return this._requisitionId;
  }

  public delete() {
    this.raiseEvent({
      event: 'BankConnectionDeleted',
      data: this,
    });
  }

  public static reconstitute(config: IBankConnection) {
    return new BankConnection(config);
  }

  public saveRequisitionId(id: string) {
    const old = BankConnection.reconstitute(this.toObject());
    this._requisitionId = id;
    this.raiseEvent({
      event: 'BankConnectionRequisitionSaved',
      data: { old, new: this },
    });
  }
}
