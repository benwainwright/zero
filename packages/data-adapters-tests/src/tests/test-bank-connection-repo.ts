import type { IBankConnectionRepository } from '@zero/accounts';
import type { IUnitOfWork } from '@zero/application-core';
import type { IUserRepository } from '@zero/auth';
import { BankConnection, User } from '@zero/domain';

export const testBankConnectionRepository = (
  create: () => Promise<{
    repo: IBankConnectionRepository;
    userRepo: IUserRepository;
    unitOfWork: IUnitOfWork;
  }>
) => {
  describe('the connection repository', () => {
    it('can update and return a connection', async () => {
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

      await unitOfWork.begin();

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
      await repo.saveConnection(connectionOne);
      await repo.saveConnection(connectionTwo);
      await unitOfWork.commit();

      await unitOfWork.begin();
      const recieved = await repo.getConnection('ben');
      await unitOfWork.commit();

      expect(recieved).toEqual(connectionOne);
    });

    it('can delete a token', async () => {
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
      await repo.saveConnection(connectionOne);
      await repo.saveConnection(connectionTwo);
      await unitOfWork.commit();

      await unitOfWork.begin();
      await repo.deleteConnection(connectionOne);
      await unitOfWork.commit();

      await unitOfWork.begin();
      const empty = await repo.getConnection('ben');
      await unitOfWork.commit();

      expect(empty).toEqual(undefined);
    });
  });
};
