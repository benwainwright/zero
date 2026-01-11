import { INSTITUTION_LIST_STORAGE_KEY } from '@constants';
import { inject } from '@core';
import type { AccountsQueries } from '@services';
import {
  AbstractQueryHandler,
  type IObjectStorage,
  type IQueryContext,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import type { BankConnection } from '@zero/domain';
import { Serialiser } from '@zero/serialiser';

export class GetOpenBankingInstitutionListQueryHandler extends AbstractQueryHandler<
  AccountsQueries,
  'GetOpenBankingInstitutionList'
> {
  public constructor(
    @inject('ObjectStore')
    private readonly store: IObjectStorage,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    authContext,
  }: IQueryContext<{
    id: string;
    key: 'GetOpenBankingInstitutionList';
    paramse: undefined;
    response: BankConnection[];
  }>): Promise<BankConnection[] | undefined> {
    this.grants.requiresNoPermissions();
    this.grants.assertLogin(authContext);

    const data = await this.store.get(
      INSTITUTION_LIST_STORAGE_KEY,
      authContext.id
    );

    const serialiser = new Serialiser();

    if (!data) {
      return undefined;
    }
    return serialiser.deserialise(data) as BankConnection[];
  }
  public override readonly name = 'GetOpenBankingInstitutionList';
}
