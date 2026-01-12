import { inject } from '@core';
import type { ICategoryRepository } from '@ports';
import type { AccountsCommands } from '@services';
import {
  AbstractCommandHandler,
  type ICommandContext,
  type IWriteRepository,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import { Category } from '@zero/domain';

export class UpdateCategoryCommandHandler extends AbstractCommandHandler<
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
    command: { id, name, description },
  }: ICommandContext<{
    id: string;
    key: 'UpdateCategoryCommand';
    params: { id: string; name: string; description: string };
  }>): Promise<void> {
    this.grants.requires({
      capability: 'category:update',
    });

    const category = await this.categoryRepo.require(id);
    category.update({ name, description });
    await this.categoryWriter.update(category);
  }

  public override readonly name = 'UpdateCategoryCommand';
}
