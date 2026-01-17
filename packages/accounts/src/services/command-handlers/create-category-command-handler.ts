import { inject } from '@core';
import type { AccountsCommands } from '@services';
import {
  AbstractRequestHandler,
  type IRequestContext,
  type IUUIDGenerator,
  type IWriteRepository,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';

import type { ILogger } from '@zero/bootstrap';
import { Category } from '@zero/domain';

import { injectable } from 'inversify';

@injectable()
export class CreateCategoryCommandHandler extends AbstractRequestHandler<
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
    params: { name, description },
  }: IRequestContext<{
    id: string;
    key: 'CreateCategoryCommand';
    params: { name: string; description: string };
    response: undefined;
  }>): Promise<undefined> {
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
