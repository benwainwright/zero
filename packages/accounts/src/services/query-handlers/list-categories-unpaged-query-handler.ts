import { inject } from '@core';
import type { ICategoryRepository } from '@ports';
import type { AccountsQueries } from '@services';
import {
  AbstractRequestHandler,
  type IRequestContext,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import type { Category } from '@zero/domain';

export class ListCategoriesUnpagedQueryHandler extends AbstractRequestHandler<
  AccountsQueries,
  'ListCategoriesQueryUnpaged'
> {
  public constructor(
    @inject('CategoryRepository')
    private readonly categories: ICategoryRepository,

    @inject('GrantService')
    private readonly grants: IGrantManager,

    @inject('Logger')
    logger: ILogger
  ) {
    super(logger);
  }

  protected override async handle({
    authContext,
  }: IRequestContext<{
    id: string;
    key: 'ListCategoriesQueryUnpaged';
    response: { categories: Category[] };
  }>): Promise<{ categories: Category[] }> {
    this.grants.assertLogin(authContext);
    this.grants.requires({
      capability: 'category:list',
    });

    const cats = await this.categories.listAll({
      userId: authContext.id,
    });

    return { categories: cats };
  }
  public override readonly name = 'ListCategoriesQueryUnpaged';
}
