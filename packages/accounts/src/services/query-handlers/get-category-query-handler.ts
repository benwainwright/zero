import { inject } from '@core';
import type { ICategoryRepository } from '@ports';
import type { AccountsQueries } from '@services';
import {
  AbstractQueryHandler,
  type IQueryContext,
} from '@zero/application-core';
import type { IGrantManager } from '@zero/auth';
import type { ILogger } from '@zero/bootstrap';
import type { Category } from '@zero/domain';

export class GetCategoryQueryHandler extends AbstractQueryHandler<
  AccountsQueries,
  'GetCategoryQuery'
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
    query: { category },
  }: IQueryContext<{
    id: string;
    key: 'GetCategoryQuery';
    params: { category: string };
    response: Category | undefined;
  }>): Promise<Category | undefined> {
    const theCat = this.categories.get(category);

    this.grants.requires({
      capability: 'category:read',
      for: theCat,
    });

    return theCat;
  }

  public override readonly name = 'GetCategoryQuery';
}
