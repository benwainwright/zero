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
  it('can update and return a token', async () => {
    const { repo, unitOfWork, userRepo, writer } = await create();

    const ben = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => await userRepo.save(ben));

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

    await unitOfWork.atomically(async () => {
      await writer.save(tokenTwo);
      await writer.save(tokenOne);
    });

    const token = await unitOfWork.atomically(
      async () => await repo.get('ben', 'monzo')
    );

    expect(token).toEqual(tokenTwo);
  });

  it('allows you to bulk update users', async () => {
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

    const first = OauthToken.reconstitute({
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

    const second = OauthToken.reconstitute({
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

    await unitOfWork.atomically(async () => {
      await writer.save(second);
      await writer.save(first);
    });

    first.refresh('foo', 'bar', new Date(), new Date());
    second.refresh('baz', 'bap', new Date(), new Date());

    await unitOfWork.atomically(async () => {
      await writer.updateAll([first, second]);
    });

    const returnedFirst = await unitOfWork.atomically(async () =>
      repo.get('ben', 'ynab')
    );
    expect(returnedFirst?.token).toEqual('foo');

    const returnedSecond = await unitOfWork.atomically(async () =>
      repo.get('ben', 'monzo')
    );
    expect(returnedSecond?.token).toEqual('baz');
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

    await unitOfWork.atomically(async () => {
      await userRepo.save(ben);
    });

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

    await unitOfWork.atomically(async () => {
      await writer.save(tokenTwo);
      await writer.save(tokenOne);
    });

    await unitOfWork.atomically(async () => {
      await writer.delete(tokenTwo);
    });

    const token = await unitOfWork.atomically(async () =>
      repo.get('ben', 'monzo')
    );
    const isPresentToken = await unitOfWork.atomically(async () =>
      repo.get('ben', 'ynab')
    );

    expect(token).toBeUndefined();
    expect(isPresentToken).toEqual(tokenOne);
  });
};
