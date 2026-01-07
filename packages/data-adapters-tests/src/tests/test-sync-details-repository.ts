import { SyncDetails, User } from '@zero/domain';
import type {
  ISyncDetailsRepository,
  IUnitOfWork,
} from '@zero/application-core';
import type { IUserRepository } from '@zero/auth';

export const testSyncDetailsRepository = (
  create: () => Promise<{
    repo: ISyncDetailsRepository;
    userRepo: IUserRepository;
    unitOfWork: IUnitOfWork;
  }>
) => {
  describe('sqlite sync details adapter', () => {
    it('can save and get sync details by id', async () => {
      const { repo, unitOfWork, userRepo } = await create();
      const ben = User.reconstitute({
        email: 'bwainwright28@gmail.com',
        id: 'ben',
        passwordHash:
          '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
        roles: [],
      });

      await unitOfWork.begin();
      await userRepo.saveUser(ben);
      await unitOfWork.commit();

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

      await unitOfWork.begin();
      await repo.saveSyncDetails(newDetails1);
      await repo.saveSyncDetails(newDetails2);
      await unitOfWork.commit();

      await unitOfWork.begin();
      const receivedDetails = await repo.getSyncDetails('foo-bar-1');
      await unitOfWork.commit();

      expect(receivedDetails).toEqual(newDetails1);
    });

    it('allows you to delete sync details', async () => {
      const { repo, unitOfWork, userRepo } = await create();
      const ben = User.reconstitute({
        email: 'bwainwright28@gmail.com',
        id: 'ben',
        passwordHash:
          '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
        roles: [],
      });

      await unitOfWork.begin();
      await userRepo.saveUser(ben);
      await unitOfWork.commit();

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

      await unitOfWork.begin();
      await repo.saveSyncDetails(newDetails1);
      await repo.saveSyncDetails(newDetails2);
      await unitOfWork.commit();

      await unitOfWork.begin();
      await repo.deleteSyncDetails(newDetails1);
      await unitOfWork.commit();

      await unitOfWork.begin();
      const receivedDetails = await repo.getSyncDetails('foo-bar-1');
      await unitOfWork.commit();

      expect(receivedDetails).toEqual(undefined);
    });

    it("returns undefined if it doesn't exist", async () => {
      const { repo, unitOfWork } = await create();

      await unitOfWork.begin();
      const receivedDetails = await repo.getSyncDetails('foo-bar-1');
      await unitOfWork.commit();

      expect(receivedDetails).toEqual(undefined);
    });
  });
};
