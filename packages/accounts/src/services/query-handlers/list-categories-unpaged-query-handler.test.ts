import { buildRequestHandler } from '@zero/test-helpers';
import { ListCategoriesUnpagedQueryHandler } from './list-categories-unpaged-query-handler.ts';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import { Category } from '@zero/domain';
describe('list categories query handler', () => {
  it('gets the list and the count from the repo and returns it', async () => {
    const {
      handler,
      context,
      dependencies: [repo],
    } = await buildRequestHandler(
      ListCategoriesUnpagedQueryHandler,
      'ListCategoriesQueryUnpaged',
      undefined,
      'ben'
    );

    const cats = [mock<Category>(), mock<Category>()];

    when(repo.listAll).calledWith({ userId: 'ben' }).thenResolve(cats);

    const result = await handler.tryHandle(context);

    expect(result.handled).toEqual(true);

    if (result.handled) {
      expect(result.response.categories).toEqual(cats);
    }
  });
});
