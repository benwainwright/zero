import type { IDomainEventBuffer, IUnitOfWork } from '@zero/application-core';

import type { Mocked } from 'vitest';
import type { IRoleRepository, IUserRepository } from '@zero/auth';
import { Role, User } from '@zero/domain';

export const testUserAndRoleRepository = (
  create: () => Promise<{
    eventBuffer: Mocked<IDomainEventBuffer>;
    userRepo: IUserRepository;
    roleRepo: IRoleRepository;
    unitOfWork: IUnitOfWork;
  }>
) => {
  describe('the role repository', () => {
    it('returns undefined if the role isnt found', async () => {
      const { roleRepo } = await create();

      const result = await roleRepo.getRole('ben');

      expect(result).toBeUndefined();
    });

    it('allows you to get a series of roles', async () => {
      const { unitOfWork, roleRepo } = await create();

      const adminRole = Role.reconstitute({
        id: 'admin',
        name: 'Administrator',
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['all'],
          },
        ],
      });

      const userRole = Role.reconstitute({
        id: 'user',
        name: 'User',
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['self:update', 'self:read'],
          },
        ],
      });

      await unitOfWork.begin();
      await roleRepo.saveRole(userRole);
      await roleRepo.saveRole(adminRole);
      await unitOfWork.commit();

      const roles = await roleRepo.getManyRoles(0, 30);

      expect(roles).toEqual(expect.arrayContaining([userRole, adminRole]));
    });

    it('can independently save and retreive roles', async () => {
      const { unitOfWork, roleRepo } = await create();

      const adminRole = Role.reconstitute({
        id: 'admin',
        name: 'Administrator',
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['all'],
          },
        ],
      });

      const userRole = Role.reconstitute({
        id: 'user',
        name: 'User',
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['self:update', 'self:read'],
          },
        ],
      });

      await unitOfWork.begin();
      await roleRepo.saveRole(userRole);
      await roleRepo.saveRole(adminRole);
      await unitOfWork.commit();

      const roleOne = await roleRepo.getRole('user');
      expect(roleOne).toEqual(userRole);

      const roleTwo = await roleRepo.getRole('admin');
      expect(roleTwo).toEqual(adminRole);
    });
  });

  describe('the user and role repositories', () => {
    it('work correctly in coordination', async () => {
      const { userRepo, unitOfWork, roleRepo } = await create();

      const adminRole = Role.reconstitute({
        id: 'admin',
        name: 'Administrator',
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['all'],
          },
        ],
      });

      const userRole = Role.reconstitute({
        id: 'user',
        name: 'User',
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['self:update', 'self:read'],
          },
        ],
      });

      await unitOfWork.begin();
      await roleRepo.saveRole(userRole);
      await roleRepo.saveRole(adminRole);
      await unitOfWork.commit();

      const data = User.reconstitute({
        email: 'bwainwright28@gmail.com',
        id: 'ben',
        passwordHash:
          '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
        roles: [userRole.toObject(), adminRole.toObject()],
      });

      await unitOfWork.begin();
      await userRepo.saveUser(data);
      await unitOfWork.commit();

      const user = await userRepo.getUser(data.id);

      expect(user?.roles).toEqual(expect.arrayContaining(data.roles));
      expect(user?.id).toEqual(data.id);
      expect(user?.email).toEqual(data.email);
      expect(user?.passwordHash).toEqual(data.passwordHash);
    });
  });

  describe('the user repository', () => {
    it('can delete a user', async () => {
      const { userRepo, unitOfWork } = await create();

      const data = User.reconstitute({
        email: 'bwainwright28@gmail.com',
        id: 'ben',
        passwordHash:
          '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
        roles: [],
      });

      await unitOfWork.begin();
      await userRepo.saveUser(data);
      await unitOfWork.commit();

      await unitOfWork.begin();
      await userRepo.deleteUser(data);
      await unitOfWork.commit();

      const result = await userRepo.getUser('ben');

      expect(result).toEqual(undefined);
    });

    it('can update and return a user', async () => {
      const { userRepo, unitOfWork } = await create();

      const data = User.reconstitute({
        email: 'bwainwright28@gmail.com',
        id: 'ben',
        passwordHash:
          '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
        roles: [],
      });

      await unitOfWork.begin();
      await userRepo.saveUser(data);
      await unitOfWork.commit();

      const user = await userRepo.getUser(data.id);

      expect(user).toEqual(data);
    });

    it('if someone tries to insert an email twice in a tx will fail due to uniqueness constraint and rollback the tx', async () => {
      const { userRepo, unitOfWork } = await create();

      const data = User.reconstitute({
        email: 'bwainwright28@gmail.com',
        id: 'ben',
        passwordHash:
          '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
        roles: [],
      });

      // email MUST be unique
      const data2 = User.reconstitute({
        email: 'bwainwright28@gmail.com',
        id: 'another-ben',
        passwordHash: 'foo',
        roles: [],
      });

      try {
        await unitOfWork.begin();
        await userRepo.saveUser(data);
        await userRepo.saveUser(data2);
        await unitOfWork.commit();
      } catch {
        // This is fine. I just want to test that there is no users inserted

        // This function is actually a noop - I'm just calling it to complete the coverage
        await unitOfWork.rollback();
      }

      const user = await userRepo.getUser(data.id);

      expect(user).toEqual(undefined);
    });

    describe('getMany', () => {
      it('can return many users', async () => {
        const { userRepo, unitOfWork } = await create();

        const data = User.reconstitute({
          email: 'bwainwright28@gmail.com',
          id: 'ben',
          passwordHash:
            '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
          roles: [],
        });

        const data2 = User.reconstitute({
          email: 'a@b.com',
          id: 'ben2',
          passwordHash:
            '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
          roles: [],
        });

        const data3 = User.reconstitute({
          email: 'a@c.com',
          id: 'ben3',
          passwordHash:
            '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
          roles: [],
        });

        await unitOfWork.begin();
        await userRepo.saveUser(data);
        await userRepo.saveUser(data2);
        await userRepo.saveUser(data3);
        await unitOfWork.commit();

        const users = await userRepo.getManyUsers();

        expect(users).toEqual(expect.arrayContaining([data, data2, data3]));
      });
    });

    it('returns undefined if not present', async () => {
      const { userRepo } = await create();

      const user = await userRepo.getUser('foo');

      expect(user).toBeUndefined();
    });
  });
};
