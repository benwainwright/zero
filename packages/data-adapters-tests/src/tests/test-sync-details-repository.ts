import { SyncDetails } from '@zero/domain';
import type {
  ISyncDetailsRepository,
  IUnitOfWork,
} from '@zero/application-core';

export const testSyncDetailsRepository = (
  create: () => Promise<{
    repo: ISyncDetailsRepository;
    unitOfWork: IUnitOfWork;
  }>
) => {
  describe('sqlite sync details adapter', () => {
    it('can save and get sync details by id', async () => {
      const { repo, unitOfWork } = await create();

      const newDetails1 = SyncDetails.reconstitute({
        id: 'foo-bar-1',
        provider: 'ynab',
        checkpoint: 'blah',
        lastSync: new Date('2025-12-10T20:39:37.823Z'),
      });

      const newDetails2 = SyncDetails.reconstitute({
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
      const { repo, unitOfWork } = await create();

      const newDetails1 = SyncDetails.reconstitute({
        id: 'foo-bar-1',
        provider: 'ynab',
        checkpoint: 'blah',
        lastSync: new Date('2025-12-10T20:39:37.823Z'),
      });

      const newDetails2 = SyncDetails.reconstitute({
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
