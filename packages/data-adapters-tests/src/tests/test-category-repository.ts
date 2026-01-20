import type { ICategoryRepository } from '@zero/accounts';
import type { IUnitOfWork, IWriteRepository } from '@zero/application-core';
import { Category, User } from '@zero/domain';

export const testCategoryRepository = (
  create: () => Promise<{
    repo: ICategoryRepository;
    writer: IWriteRepository<Category>;
    userRepo: IWriteRepository<User>;
    unitOfWork: IUnitOfWork;
  }>
) => {
  it('can save and get categories by id', async () => {
    const { repo, unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => await userRepo.save(ben));

    const first = Category.reconstitute({
      id: 'baz',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });
    const second = Category.reconstitute({
      id: 'bip',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(first);
      await writer.save(second);
    });

    const result = await unitOfWork.atomically(
      async () => await repo.get('bip')
    );

    expect(result).toEqual(second);
  });

  it('allows you to bulk update categories', async () => {
    const { unitOfWork, userRepo, repo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash: '',
      roles: [],
    });

    const fred = User.reconstitute({
      email: 'a@b.c',
      id: 'fred',
      passwordHash: '',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
      await userRepo.save(fred);
    });

    ben.update({
      email: 'z@b.c',
    });

    fred.update({
      email: 'h@j.c',
    });

    const first = Category.reconstitute({
      id: 'baz',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });
    const second = Category.reconstitute({
      id: 'bip',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(second);
      await writer.save(first);
    });

    first.update({
      name: 'baz',
    });
    second.update({ name: 'bap' });

    await unitOfWork.atomically(async () => {
      await writer.updateAll([first, second]);
    });

    const returnedFirst = await unitOfWork.atomically(async () =>
      repo.get(first.id)
    );
    expect(returnedFirst?.name).toEqual('baz');

    const returnedSecond = await unitOfWork.atomically(async () =>
      repo.get(second.id)
    );
    expect(returnedSecond?.name).toEqual('bap');
  });

  it('can save and get categories by id', async () => {
    const { repo, unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => await userRepo.save(ben));

    const first = Category.reconstitute({
      id: 'baz',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });
    const second = Category.reconstitute({
      id: 'bip',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(first);
      await writer.save(second);
    });

    const result = await unitOfWork.atomically(
      async () => await repo.get('bip')
    );

    expect(result).toEqual(second);
  });

  it('can delete a category', async () => {
    const { repo, unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
    });

    const first = Category.reconstitute({
      id: 'baz',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });
    const second = Category.reconstitute({
      id: 'bip',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(first);
      await writer.save(second);
    });

    await unitOfWork.atomically(async () => {
      await writer.delete(second);
    });

    const result = await unitOfWork.atomically(async () => {
      return await repo.get('bip');
    });

    expect(result).toEqual(undefined);
  });

  it('throws an error if the category already exists with the same id when calling save', async () => {
    const { unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
    });

    const first = Category.reconstitute({
      id: 'baz',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });
    const second = Category.reconstitute({
      id: 'baz',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });

    await expect(
      unitOfWork.atomically(async () => {
        await writer.save(first);
        await writer.save(second);
      })
    ).rejects.toThrow();
  });

  it('allows me to update a category using the update method', async () => {
    const { repo, unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
    });

    const first = Category.reconstitute({
      id: 'baz',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });

    const second = Category.reconstitute({
      id: 'baz',
      name: 'foo',
      description: 'baz',
      ownerId: 'ben',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(first);
      await writer.update(second);
    });

    const result = await unitOfWork.atomically(async () => {
      return await repo.get('baz');
    });

    expect(result).toEqual(second);
  });

  it('throws an error on calling rquire if the category doesnt exist', async () => {
    const { repo, unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
    });

    const first = Category.reconstitute({
      id: 'baz',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });

    await unitOfWork.atomically(async () => {
      await writer.save(first);
    });

    await expect(
      unitOfWork.atomically(async () => {
        return await repo.require('bip');
      })
    ).rejects.toThrow();
  });

  it('allows me to save a number of different categories with saveAll', async () => {
    const { repo, unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
    });

    const first = Category.reconstitute({
      id: 'baz',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });
    const second = Category.reconstitute({
      id: 'bip',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });

    await unitOfWork.atomically(async () => {
      await writer.saveAll([first, second]);
    });

    const resultOne = await unitOfWork.atomically(async () => {
      return await repo.get('bip');
    });

    const resultTwo = await unitOfWork.atomically(async () => {
      return await repo.get('baz');
    });

    expect(resultOne).toEqual(second);
    expect(resultTwo).toEqual(first);
  });

  it('lists all the cateogires owned by the specified user when calling list', async () => {
    const { repo, unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash: '',
      roles: [],
    });

    const fred = User.reconstitute({
      email: 'a@b.c',
      id: 'fred',
      passwordHash: '',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userRepo.saveAll([ben, fred]);
    });

    const first = Category.reconstitute({
      id: 'baz',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });
    const second = Category.reconstitute({
      id: 'bip',
      name: 'foo',
      description: 'foo',
      ownerId: 'ben',
    });

    const third = Category.reconstitute({
      id: 'bof',
      name: 'foo',
      description: 'foo',
      ownerId: 'fred',
    });

    await unitOfWork.atomically(async () => {
      await writer.saveAll([first, second, third]);
    });

    const results = await unitOfWork.atomically(async () => {
      return await repo.list({ userId: 'ben', start: 0, limit: 30 });
    });

    expect(results).toEqual([first, second]);
  });

  it('respects the paging limits', async () => {
    const { repo, unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash: '',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
    });

    const categories = Array.from({ length: 40 }).map((_, index) =>
      Category.reconstitute({
        id: `the-id-${index}`,
        name: 'foo',
        description: 'foo',
        ownerId: 'ben',
      })
    );

    await unitOfWork.atomically(async () => {
      await writer.saveAll(categories);
    });

    const results = await unitOfWork.atomically(async () => {
      return await repo.list({ userId: 'ben', start: 0, limit: 30 });
    });

    expect(results).toHaveLength(30);
  });
};
