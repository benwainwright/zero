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
import type { Category } from '@zero/domain';

export class DeleteCategoryCommandHandler extends AbstractRequestHandler<
  AccountsCommands,
  'DeleteCategoryCommand'
> {
  public constructor(
    @inject('CategoryRepository')
    private categoryRepo: ICategoryRepository,

    @inject('CategoryWriter')
    private categoryWriter: IWriteRepository<Category>,

    @inject('GrantService')
    private grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    authContext,
    params: { id },
  }: IRequestContext<{
    id: string;
    key: 'DeleteCategoryCommand';
    params: { id: string };
    response: undefined;
  }>): Promise<undefined> {
    this.grants.assertLogin(authContext);
    this.grants.requires({
      capability: 'category:delete',
    });

    const theCategory = await this.categoryRepo.require(id);
    theCategory.delete();
    await this.categoryWriter.delete(theCategory);
  }

  public override readonly name = 'DeleteCategoryCommand';
}
