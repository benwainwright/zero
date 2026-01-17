import { SyncDetails, User } from '@zero/domain';
import type {
  ISyncDetailsRepository,
  IUnitOfWork,
  IWriteRepository,
} from '@zero/application-core';

export const testSyncDetailsRepository = (
  create: () => Promise<{
    repo: ISyncDetailsRepository;
    writer: IWriteRepository<SyncDetails>;
    userRepo: IWriteRepository<User>;
    unitOfWork: IUnitOfWork;
  }>
) => {
  it('can save and get sync details by id', async () => {
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

    const newDetails1 = SyncDetails.reconstitute({
      id: 'foo-bar-1',
      ownerId: 'ben',
      provider: 'ynab',
      checkpoint: 'blah',
      lastSync: new Date('2025-12-10T20:39:37.823Z'),
    });

    const newDetails2 = SyncDetails.reconstitute({
      ownerId: 'ben',
      id: 'foo-bar-2',
      provider: 'ynab',
      checkpoint: 'blah',
      lastSync: new Date('2025-12-10T20:39:37.823Z'),
    });

    await unitOfWork.atomically(async () => {
      await writer.save(newDetails1);
      await writer.save(newDetails2);
    });

    const receivedDetails = await unitOfWork.atomically(
      async () => await repo.get('foo-bar-1')
    );

    expect(receivedDetails).toEqual(newDetails1);
  });

  it('allows you to delete sync details', async () => {
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

    const newDetails1 = SyncDetails.reconstitute({
      ownerId: 'ben',
      id: 'foo-bar-1',
      provider: 'ynab',
      checkpoint: 'blah',
      lastSync: new Date('2025-12-10T20:39:37.823Z'),
    });

    const newDetails2 = SyncDetails.reconstitute({
      ownerId: 'ben',
      id: 'foo-bar-2',
      provider: 'ynab',
      checkpoint: 'blah',
      lastSync: new Date('2025-12-10T20:39:37.823Z'),
    });

    await unitOfWork.atomically(async () => {
      await writer.save(newDetails1);
      await writer.save(newDetails2);
    });

    await unitOfWork.atomically(async () => await writer.delete(newDetails1));

    const receivedDetails = await unitOfWork.atomically(
      async () => await repo.get('foo-bar-1')
    );

    expect(receivedDetails).toEqual(undefined);
  });

  it("returns undefined if it doesn't exist", async () => {
    const { repo, unitOfWork } = await create();

    const receivedDetails = await unitOfWork.atomically(
      async () => await repo.get('foo-bar-1')
    );

    expect(receivedDetails).toEqual(undefined);
  });
};
