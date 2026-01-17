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

export class ListCategoriesQueryHandler extends AbstractRequestHandler<
  AccountsQueries,
  'ListCategoriesQuery'
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
    params: { offset, limit },
    authContext,
  }: IRequestContext<{
    id: string;
    key: 'ListCategoriesQuery';
    params: { offset: number; limit: number };
    response: { categories: Category[] };
  }>): Promise<{ categories: Category[] }> {
    this.grants.assertLogin(authContext);
    this.grants.requires({
      capability: 'category:list',
    });

    const cats = await this.categories.list({
      start: offset,
      limit,
      userId: authContext.id,
    });

    return { categories: cats };
  }
  public override readonly name = 'ListCategoriesQuery';
}
