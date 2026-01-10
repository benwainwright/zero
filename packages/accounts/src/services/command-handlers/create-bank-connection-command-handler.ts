import { inject } from '@core';
import type { IInstitutionAuthPageLinkFetcher } from '@ports';
import type { AccountsCommands, OpenBankingTokenManager } from '@services';
import {
  AbstractCommandHandler,
  type ICommandContext,
  type IObjectStorage,
  type IWriteRepository,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import type { BankConnection } from '@zero/domain';

export class CreateBankConnectionCommandHandler extends AbstractCommandHandler<
  AccountsCommands,
  'CreateBankConnectionCommand'
> {
  public override readonly name = 'CreateBankConnectionCommand';
  public constructor(
    @inject('InstitutionAuthPageLinkFetcher')
    private authLinkFetcher: IInstitutionAuthPageLinkFetcher,

    @inject('BankConnectionWriter')
    private bankConnectionRepository: IWriteRepository<BankConnection>,

    @inject('OpenBankingTokenManager')
    private tokenManager: OpenBankingTokenManager,

    @inject('ObjectStore')
    private store: IObjectStorage,

    @inject('GrantService')
    private grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }
  protected override async handle({
    authContext,
    command: connection,
  }: ICommandContext<{
    id: string;
    key: 'CreateBankConnectionCommand';
    params: BankConnection;
  }>): Promise<void> {
    this.grants.requires({
      capability: 'bank-connection:update',
    });

    this.grants.requires({
      capability: 'bank-connection:create',
    });

    this.grants.assertLogin(authContext);

    const token = await this.tokenManager.getToken(authContext.id);
    const { url, requsitionId } = await this.authLinkFetcher.getLink(
      connection,
      token
    );
    connection.saveRequisitionId(requsitionId);
    await this.store.set('bank-auth-link', authContext.id, url);
    await this.bankConnectionRepository.save(connection);
  }
}
