import { buildCommandHandler } from '@zero/test-helpers';
import { UpdateCategoryCommandHandler } from './update-category-command-handler.ts';
import { when } from 'vitest-when';
import { mock } from 'vitest-mock-extended';
import { Category } from '@zero/domain';

describe('update category command handler', () => {
  it('update the category then saves to the repo', async () => {
    const {
      handler,
      context,
      dependencies: [categoryRepo, categoryWriter],
    } = await buildCommandHandler(
      UpdateCategoryCommandHandler,
      'UpdateCategoryCommand',
      { id: 'foo-bar', name: 'foo-name', description: 'foo-description' },
      'ben'
    );

    const category = mock<Category>();

    when(categoryRepo.require).calledWith('foo-bar').thenResolve(category);

    await handler.tryHandle(context);

    expect(category.update).toHaveBeenCalledWith({
      name: 'foo-name',
      description: 'foo-description',
    });

    expect(categoryWriter.update).toHaveBeenCalledWith(category);
  });
});
