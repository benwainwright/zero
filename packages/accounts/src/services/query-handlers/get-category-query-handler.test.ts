import { buildRequestHandler } from '@zero/test-helpers';
import { GetCategoryQueryHandler } from './get-category-query-handler.ts';
import { when } from 'vitest-when';
import { Category } from '@zero/domain';
import { mock } from 'vitest-mock-extended';

describe('get category query handler', () => {
  it('gets the category from the repo', async () => {
    const {
      handler,
      context,
      dependencies: [repo],
    } = await buildRequestHandler(GetCategoryQueryHandler, 'GetCategoryQuery', {
      category: 'foo',
    });

    const cat = mock<Category>();

    when(repo.require).calledWith('foo').thenResolve(cat);

    const result = await handler.tryHandle(context);

    expect(result.handled).toEqual(true);
    if (result.handled) {
      expect(result.response).toEqual(cat);
    }
  });
});
