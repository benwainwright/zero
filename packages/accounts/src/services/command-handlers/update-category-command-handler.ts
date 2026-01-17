import { inject } from '@core';
import type { ICategoryRepository } from '@ports';
import type { AccountsCommands } from '@services';
import {
  AbstractRequestHandler,
  type IRequestContext,
  type IWriteRepository,
} from '@zero/application-core';

import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import { Category } from '@zero/domain';

export class UpdateCategoryCommandHandler extends AbstractRequestHandler<
  AccountsCommands,
  'UpdateCategoryCommand'
> {
  public constructor(
    @inject('CategoryRepository')
    private readonly categoryRepo: ICategoryRepository,

    @inject('CategoryWriter')
    private readonly categoryWriter: IWriteRepository<Category>,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    params: { id, name, description },
  }: IRequestContext<{
    id: string;
    key: 'UpdateCategoryCommand';
    params: { id: string; name: string; description: string };
    response: undefined;
  }>): Promise<undefined> {
    this.grants.requires({
      capability: 'category:update',
    });

    const category = await this.categoryRepo.require(id);
    category.update({ name, description });
    await this.categoryWriter.update(category);
  }

  public override readonly name = 'UpdateCategoryCommand';
}
