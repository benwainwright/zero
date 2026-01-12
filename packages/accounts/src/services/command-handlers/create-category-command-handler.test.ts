import { buildCommandHandler } from '@zero/test-helpers';
import { CreateCategoryCommandHandler } from './create-category-command-handler.ts';
import { when } from 'vitest-when';
import { Category } from '@zero/domain';
import { mock } from 'vitest-mock-extended';

vi.mock('@zero/domain');

afterEach(() => {
  vi.resetAllMocks();
});

describe('create category command handler', () => {
  it('creates the category in the repo', async () => {
    const {
      handler,
      dependencies: [categoryWriter, uuidGenerator],
      context,
    } = await buildCommandHandler(
      CreateCategoryCommandHandler,
      'CreateCategoryCommand',
      {
        name: 'foo',
        description: 'bar',
      },
      'ben'
    );

    const category = mock<Category>();

    when(Category.create)
      .calledWith({
        id: 'uuid',
        name: 'foo',
        description: 'foo',
        ownerId: 'ben',
      })
      .thenReturn(category);

    when(uuidGenerator.v7).calledWith().thenReturn('uuid');

    await handler.tryHandle(context);

    expect(categoryWriter.save).toHaveBeenCalledWith(category);
  });
});
