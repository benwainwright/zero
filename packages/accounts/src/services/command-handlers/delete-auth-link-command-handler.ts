import { BANK_AUTH_LINK_STORAGE_KEY } from '@constants';
import { inject } from '@core';
import type { AccountsCommands } from '@services';
import {
  AbstractCommandHandler,
  type ICommandContext,
  type IObjectStorage,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';

export class DeleteAuthLinkCommandHandler extends AbstractCommandHandler<
  AccountsCommands,
  'DeleteAuthLinkCommand'
> {
  public constructor(
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
  }: ICommandContext<{
    id: string;
    key: 'DeleteAuthLinkCommand';
    params: undefined;
  }>): Promise<void> {
    this.grants.assertLogin(authContext);
    this.grants.requiresNoPermissions();
    await this.store.set(BANK_AUTH_LINK_STORAGE_KEY, authContext.id, undefined);
  }

  public override readonly name = 'DeleteAuthLinkCommand';
}
