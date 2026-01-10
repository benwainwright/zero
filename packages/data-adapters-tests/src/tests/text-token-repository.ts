import type { IUnitOfWork, IWriteRepository } from '@zero/application-core';
import type { IOauthTokenRepository } from '@zero/accounts';
import { OauthToken, User } from '@zero/domain';

export const testOauthRepository = (
  create: () => Promise<{
    repo: IOauthTokenRepository;
    writer: IWriteRepository<OauthToken>;
    userRepo: IWriteRepository<User>;

    unitOfWork: IUnitOfWork;
  }>
) => {
  describe('the token repository', () => {
    it('can update and return a token', async () => {
      const { repo, unitOfWork, userRepo, writer } = await create();

      const ben = User.reconstitute({
        email: 'bwainwright28@gmail.com',
        id: 'ben',
        passwordHash:
          '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
        roles: [],
      });

      await unitOfWork.begin();
      await userRepo.save(ben);
      await unitOfWork.commit();

      const tokenOne = OauthToken.reconstitute({
        id: 'foo',
        refreshExpiry: undefined,
        provider: 'ynab',
        expiry: new Date('2025-12-11T20:39:37.823Z'),
        token: 'foo',
        ownerId: 'ben',
        refreshToken: 'bar',
        lastUse: new Date('2025-12-10T20:39:37.823Z'),
        refreshed: new Date('2025-07-10T20:39:37.823Z'),
        created: new Date('2025-05-10T20:39:37.823Z'),
      });

      const tokenTwo = OauthToken.reconstitute({
        refreshExpiry: new Date(),
        provider: 'monzo',
        id: 'bar',
        ownerId: 'ben',
        expiry: new Date('2025-11-11T20:39:37.823Z'),
        token: 'foo-bar',
        refreshToken: 'bap',
        lastUse: new Date('2025-12-10T20:39:37.823Z'),
        refreshed: new Date('2025-10-10T20:39:37.823Z'),
        created: new Date('2025-11-10T20:39:37.823Z'),
      });

      await unitOfWork.begin();
      await writer.save(tokenTwo);
      await writer.save(tokenOne);
      await unitOfWork.commit();

      await unitOfWork.begin();
      const token = await repo.get('ben', 'monzo');
      await unitOfWork.commit();

      expect(token).toEqual(tokenTwo);
    });

    it('can delete a token', async () => {
      const { repo, unitOfWork, userRepo, writer } = await create();

      const ben = User.reconstitute({
        email: 'bwainwright28@gmail.com',
        id: 'ben',
        passwordHash:
          '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
        roles: [],
      });

      await unitOfWork.begin();
      await userRepo.save(ben);
      await unitOfWork.commit();

      const tokenOne = OauthToken.reconstitute({
        refreshExpiry: undefined,
        provider: 'ynab',
        expiry: new Date('2025-12-11T20:39:37.823Z'),
        token: 'foo',
        id: 'boo',
        ownerId: 'ben',
        refreshToken: 'bar',
        lastUse: new Date('2025-12-10T20:39:37.823Z'),
        refreshed: new Date('2025-07-10T20:39:37.823Z'),
        created: new Date('2025-05-10T20:39:37.823Z'),
      });

      const tokenTwo = OauthToken.reconstitute({
        refreshExpiry: new Date(),
        provider: 'monzo',
        ownerId: 'ben',
        id: 'bop',
        expiry: new Date('2025-11-11T20:39:37.823Z'),
        token: 'foo-bar',
        refreshToken: 'bap',
        lastUse: new Date('2025-12-10T20:39:37.823Z'),
        refreshed: new Date('2025-10-10T20:39:37.823Z'),
        created: new Date('2025-11-10T20:39:37.823Z'),
      });

      await unitOfWork.begin();
      await writer.save(tokenTwo);
      await writer.save(tokenOne);
      await unitOfWork.commit();

      await unitOfWork.begin();
      await writer.delete(tokenTwo);
      await unitOfWork.commit();
      await unitOfWork.begin();
      const token = await repo.get('ben', 'monzo');
      await unitOfWork.commit();

      await unitOfWork.begin();
      const isPresentToken = await repo.get('ben', 'ynab');
      await unitOfWork.commit();

      expect(token).toBeUndefined();
      expect(isPresentToken).toEqual(tokenOne);
    });
  });
};
