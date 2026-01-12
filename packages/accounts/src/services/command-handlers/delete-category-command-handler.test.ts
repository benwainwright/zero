import { buildCommandHandler } from '@zero/test-helpers';
import { DeleteCategoryCommandHandler } from './delete-category-command-handler.ts';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import { Category } from '@zero/domain';

describe('delete category command handler', () => {
  it('calls delete on the category then deletes in the repo', async () => {
    const {
      handler,
      context,
      dependencies: [categoryRepo, categoryWriter],
    } = await buildCommandHandler(
      DeleteCategoryCommandHandler,
      'DeleteCategoryCommand',
      { id: 'foo' }
    );

    const category = mock<Category>();

    when(categoryRepo.require).calledWith('foo').thenResolve(category);

    await handler.tryHandle(context);

    expect(category.delete).toHaveBeenCalled();

    expect(categoryWriter.delete).toHaveBeenCalledWith(category);
  });
});
