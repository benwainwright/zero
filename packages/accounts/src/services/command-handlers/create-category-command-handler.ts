import { inject } from '@core';
import type { AccountsCommands } from '@services';
import {
  AbstractCommandHandler,
  type ICommandContext,
  type IUUIDGenerator,
  type IWriteRepository,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';

import type { ILogger } from '@zero/bootstrap';
import { Category } from '@zero/domain';

import { injectable } from 'inversify';

@injectable()
export class CreateCategoryCommandHandler extends AbstractCommandHandler<
  AccountsCommands,
  'CreateCategoryCommand'
> {
  public constructor(
    @inject('CategoryWriter')
    private readonly categories: IWriteRepository<Category>,

    @inject('UUIDGenerator')
    private readonly uuidGenerator: IUUIDGenerator,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    authContext,
    command: { name, description },
  }: ICommandContext<{
    id: string;
    key: 'CreateCategoryCommand';
    params: { name: string; description: string };
  }>): Promise<void> {
    this.grants.assertLogin(authContext);
    this.grants.requires({ capability: 'category:create' });

    const uuid = this.uuidGenerator.v7();

    const config = {
      id: uuid,
      name,
      description,
      ownerId: authContext.id,
    };

    const category = Category.create(config);

    await this.categories.save(category);
  }

  public override readonly name = 'CreateCategoryCommand';
}
