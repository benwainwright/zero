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
        routes: ['all'],
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
        routes: ['home'],
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
        routes: ['home'],
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
        routes: ['home', 'login'],
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

    it('can respect pagination when fetching many roles', async () => {
      const { unitOfWork, roleRepo } = await create();

      const roles = Array.from({ length: 8 }, (_, index) =>
        Role.reconstitute({
          routes: ['home'],
          id: `role-${index}`,
          name: `Role ${index}`,
          permissions: [
            {
              resource: '*',
              action: 'ALLOW',
              capabilities: ['all'],
            },
          ],
        })
      );

      await unitOfWork.begin();
      for (const role of roles) {
        await roleRepo.saveRole(role);
      }
      await unitOfWork.commit();

      const limitedRoles = await roleRepo.getManyRoles(2, 3);
      const overflowingRoles = await roleRepo.getManyRoles(20, 5);

      expect(limitedRoles).toHaveLength(3);
      limitedRoles.forEach((role) =>
        expect(roles.map((existingRole) => existingRole.id)).toContain(role.id)
      );

      expect(overflowingRoles).toHaveLength(0);
    });
  });

  describe('the user and role repositories', () => {
    it('work correctly in coordination', async () => {
      const { userRepo, unitOfWork, roleRepo } = await create();

      const adminRole = Role.reconstitute({
        routes: ['home'],
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
        routes: ['home'],
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

    it('replaces role assignments when updating a user', async () => {
      const { userRepo, roleRepo, unitOfWork } = await create();

      const adminRole = Role.reconstitute({
        routes: ['home'],
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

      const viewerRole = Role.reconstitute({
        routes: ['home'],
        id: 'viewer',
        name: 'Viewer',
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['user:read'],
          },
        ],
      });

      await unitOfWork.begin();
      await roleRepo.saveRole(adminRole);
      await roleRepo.saveRole(viewerRole);
      await unitOfWork.commit();

      const originalUser = User.reconstitute({
        email: 'user@example.com',
        id: 'changing-roles',
        passwordHash: 'hash',
        roles: [adminRole.toObject()],
      });

      await unitOfWork.begin();
      await userRepo.saveUser(originalUser);
      await unitOfWork.commit();

      const updatedUser = User.reconstitute({
        ...originalUser.toObject(),
        roles: [viewerRole.toObject()],
      });

      await unitOfWork.begin();
      await userRepo.saveUser(updatedUser);
      await unitOfWork.commit();

      const retrieved = await userRepo.getUser(updatedUser.id);

      expect(retrieved?.roles).toEqual([viewerRole]);
      expect(retrieved?.roles).not.toEqual(originalUser.roles);
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

    it('rolls back conflicting updates that violate unique email constraints', async () => {
      const { userRepo, unitOfWork } = await create();

      const userOne = User.reconstitute({
        email: 'first@example.com',
        id: 'first',
        passwordHash: 'hash',
        roles: [],
      });

      const userTwo = User.reconstitute({
        email: 'second@example.com',
        id: 'second',
        passwordHash: 'hash',
        roles: [],
      });

      await unitOfWork.begin();
      await userRepo.saveUser(userOne);
      await userRepo.saveUser(userTwo);
      await unitOfWork.commit();

      const conflictingUserTwo = User.reconstitute({
        ...userTwo.toObject(),
        email: userOne.email,
      });

      try {
        await unitOfWork.begin();
        await userRepo.saveUser(conflictingUserTwo);
        await unitOfWork.commit();
      } catch {
        await unitOfWork.rollback();
      }

      const persistedUserOne = await userRepo.getUser(userOne.id);
      const persistedUserTwo = await userRepo.getUser(userTwo.id);

      expect(persistedUserOne?.email).toBe(userOne.email);
      expect(persistedUserTwo?.email).toBe(userTwo.email);
    });

    describe('requireUser', () => {
      it('returns a user if present', async () => {
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

        const user = await userRepo.requireUser('ben');

        expect(user).toEqual(data);
      });
      it('throws if not present', async () => {
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

        await expect(userRepo.requireUser('another-user')).rejects.toThrow();
      });
    });

    describe('requireRole', () => {
      it('throws an error one is not present', async () => {
        const { roleRepo } = await create();

        await expect(roleRepo.requireRole('viewer')).rejects.toThrow();
      });
      it('returns a role if one is present', async () => {
        const { roleRepo, unitOfWork } = await create();

        const viewerRole = Role.reconstitute({
          routes: ['home'],
          id: 'viewer',
          name: 'Viewer',
          permissions: [
            {
              resource: '*',
              action: 'ALLOW',
              capabilities: ['user:read'],
            },
          ],
        });

        await unitOfWork.begin();
        await roleRepo.saveRole(viewerRole);
        await unitOfWork.commit();
        expect(await roleRepo.requireRole('viewer')).toEqual(viewerRole);
      });
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

      it('respects limits when returning many users', async () => {
        const { userRepo, unitOfWork } = await create();

        const manyUsers = Array.from({ length: 45 }, (_, index) =>
          User.reconstitute({
            email: `bulk-${index}@example.com`,
            id: `bulk-${index}`,
            passwordHash: 'hash',
            roles: [],
          })
        );

        await unitOfWork.begin();
        for (const user of manyUsers) {
          await userRepo.saveUser(user);
        }
        await unitOfWork.commit();

        const defaultLimitedUsers = await userRepo.getManyUsers();
        const offsetLimitedUsers = await userRepo.getManyUsers(40, 10);

        expect(defaultLimitedUsers).toHaveLength(30);
        expect(defaultLimitedUsers).toEqual(
          expect.arrayContaining([manyUsers[0], manyUsers[29]])
        );

        expect(offsetLimitedUsers).toHaveLength(5);
        offsetLimitedUsers.forEach((user) =>
          expect(manyUsers.map((existing) => existing.id)).toContain(user.id)
        );
      });
    });

    it('returns undefined if not present', async () => {
      const { userRepo } = await create();

      const user = await userRepo.getUser('foo');

      expect(user).toBeUndefined();
    });
  });
};
