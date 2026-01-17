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

export class GetCategoryQueryHandler extends AbstractRequestHandler<
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
    params: { category },
  }: IRequestContext<{
    id: string;
    key: 'GetCategoryQuery';
    params: { category: string };
    response: Category;
  }>): Promise<Category> {
    const theCat = this.categories.require(category);

    this.grants.requires({
      capability: 'category:read',
      for: theCat,
    });

    return theCat;
  }

  public override readonly name = 'GetCategoryQuery';
}
