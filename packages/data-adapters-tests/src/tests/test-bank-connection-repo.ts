import type { IInstitutionListFetcher } from '@zero/accounts';
import type { IUnitOfWork, IWriteRepository } from '@zero/application-core';
import { BankConnection, User } from '@zero/domain';

export const testBankConnectionRepository = (
  create: () => Promise<{
    repo: IInstitutionListFetcher;
    writer: IWriteRepository<BankConnection>;
    userRepo: IWriteRepository<User>;
    unitOfWork: IUnitOfWork;
  }>
) => {
  describe('the connection repository', () => {
    it('can update and return a connection', async () => {
      const { repo, unitOfWork, userRepo, writer } = await create();
      try {
        const ben = User.reconstitute({
          email: 'bwainwright28@gmail.com',
          id: 'ben',
          passwordHash:
            '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
          roles: [],
        });

        const fred = User.reconstitute({
          email: 'a@b.c',
          id: 'fred',
          passwordHash:
            '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
          roles: [],
        });

        await unitOfWork.begin();
        await userRepo.save(ben);
        await userRepo.save(fred);
        await unitOfWork.commit();

        const connectionOne = BankConnection.reconstitute({
          bankName: 'foo',
          id: 'foo-2',
          ownerId: 'ben',
          logo: 'bar',
          requisitionId: 'baz',
          accounts: ['foo', 'bar'],
        });

        const connectionTwo = BankConnection.reconstitute({
          bankName: 'foo',
          id: 'foo-3',
          ownerId: 'fred',
          logo: 'bar',
          requisitionId: 'baz',
        });

        await unitOfWork.begin();
        await writer.save(connectionOne);
        await writer.save(connectionTwo);
        await unitOfWork.commit();

        await unitOfWork.begin();
        const recieved = await repo.get('ben');
        await unitOfWork.commit();

        expect(recieved).toEqual(connectionOne);
      } catch (error) {
        console.log(error);
        await unitOfWork.rollback();
        expect.fail('Failure detected');
      }
    });

    it('can delete a token', async () => {
      const { repo, unitOfWork, userRepo, writer } = await create();
      try {
        const ben = User.reconstitute({
          email: 'bwainwright28@gmail.com',
          id: 'ben',
          passwordHash:
            '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
          roles: [],
        });

        const fred = User.reconstitute({
          email: 'a@b.c',
          id: 'fred',
          passwordHash:
            '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
          roles: [],
        });

        await unitOfWork.begin();
        await userRepo.save(ben);
        await userRepo.save(fred);
        await unitOfWork.commit();

        const connectionOne = BankConnection.reconstitute({
          bankName: 'foo',
          id: 'foo-2',
          ownerId: 'ben',
          logo: 'bar',
          requisitionId: 'baz',
        });

        const connectionTwo = BankConnection.reconstitute({
          bankName: 'foo',
          id: 'foo-3',
          ownerId: 'fred',
          logo: 'bar',
          requisitionId: 'baz',
        });

        await unitOfWork.begin();
        await writer.save(connectionOne);
        await writer.save(connectionTwo);
        await unitOfWork.commit();

        await unitOfWork.begin();
        await writer.delete(connectionOne);
        await unitOfWork.commit();

        await unitOfWork.begin();
        const empty = await repo.get('ben');
        await unitOfWork.commit();

        expect(empty).toEqual(undefined);
      } catch (error) {
        console.log(error);
        await unitOfWork.rollback();
        expect.fail('Failure detected');
      }
    });
  });
};
