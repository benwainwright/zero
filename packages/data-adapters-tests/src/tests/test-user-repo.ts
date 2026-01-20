import type { IUnitOfWork, IWriteRepository } from '@zero/application-core';
import type { IRoleRepository, IUserRepository } from '@zero/auth';

import { Role, User } from '@zero/domain';

export const testUserAndRoleRepository = (
  create: () => Promise<{
    userRepo: IUserRepository;
    userWriter: IWriteRepository<User>;
    roleRepo: IRoleRepository;
    roleWriter: IWriteRepository<Role>;
    unitOfWork: IUnitOfWork;
  }>
) => {
  it('returns undefined if the role isnt found', async () => {
    const { roleRepo, unitOfWork } = await create();

    const result = await unitOfWork.atomically(
      async () => await roleRepo.get('ben')
    );

    expect(result).toBeUndefined();
  });

  it('allows you to get a series of roles', async () => {
    const { unitOfWork, roleRepo, roleWriter } = await create();

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

    await unitOfWork.atomically(async () => {
      await roleWriter.save(userRole);
      await roleWriter.save(adminRole);
    });

    const roles = await unitOfWork.atomically(
      async () => await roleRepo.list({ start: 0, limit: 30 })
    );

    expect(roles).toEqual(expect.arrayContaining([userRole, adminRole]));
  });

  it('allows you to bulk update roles', async () => {
    const { unitOfWork, roleRepo, roleWriter } = await create();

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

    await unitOfWork.atomically(async () => {
      await roleWriter.save(userRole);
      await roleWriter.save(adminRole);
    });

    userRole.update({
      name: 'bar',
    });

    adminRole.update({
      name: 'baz',
    });

    await unitOfWork.atomically(async () => {
      await roleWriter.updateAll([userRole, adminRole]);
    });

    const returnedUser = await unitOfWork.atomically(async () =>
      roleRepo.get(userRole.id)
    );
    expect(returnedUser?.name).toEqual('bar');

    const returnedAdmin = await unitOfWork.atomically(async () =>
      roleRepo.get(adminRole.id)
    );
    expect(returnedAdmin?.name).toEqual('baz');
  });

  it('allows you to bulk update users', async () => {
    const { unitOfWork, userRepo, userWriter } = await create();

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
      await userWriter.save(ben);
      await userWriter.save(fred);
    });

    ben.update({
      email: 'z@b.c',
    });

    fred.update({
      email: 'h@j.c',
    });

    await unitOfWork.atomically(async () => {
      await userWriter.updateAll([ben, fred]);
    });

    const returnedBen = await unitOfWork.atomically(async () =>
      userRepo.get(ben.id)
    );
    expect(returnedBen?.email).toEqual('z@b.c');

    const returnedFred = await unitOfWork.atomically(async () =>
      userRepo.get(fred.id)
    );
    expect(returnedFred).toBeDefined();
    expect(returnedFred?.email).toEqual('h@j.c');
  });

  it('can independently save and retreive roles', async () => {
    const { unitOfWork, roleRepo, roleWriter } = await create();

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

    await unitOfWork.atomically(async () => {
      await roleWriter.save(userRole);
      await roleWriter.save(adminRole);
    });

    const roleOne = await unitOfWork.atomically(
      async () => await roleRepo.get('user')
    );

    expect(roleOne).toEqual(userRole);

    const roleTwo = await unitOfWork.atomically(
      async () => await roleRepo.get('admin')
    );

    expect(roleTwo).toEqual(adminRole);
  });

  it('can respect pagination when fetching many roles', async () => {
    const { unitOfWork, roleRepo, roleWriter } = await create();

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

    await unitOfWork.atomically(async () => {
      for (const role of roles) {
        await roleWriter.save(role);
      }
    });

    const limitedRoles = await unitOfWork.atomically(
      async () => await roleRepo.list({ start: 2, limit: 3 })
    );

    const overflowingRoles = await unitOfWork.atomically(
      async () => await roleRepo.list({ start: 20, limit: 5 })
    );

    expect(limitedRoles).toHaveLength(3);
    limitedRoles.forEach((role) =>
      expect(roles.map((existingRole) => existingRole.id)).toContain(role.id)
    );

    expect(overflowingRoles).toHaveLength(0);
  });

  it('work correctly in coordination', async () => {
    const { userRepo, unitOfWork, roleWriter, userWriter } = await create();

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

    await unitOfWork.atomically(async () => {
      await roleWriter.save(userRole);
      await roleWriter.save(adminRole);
    });

    const data = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [userRole.toObject(), adminRole.toObject()],
    });

    await unitOfWork.atomically(async () => await userWriter.save(data));

    const user = await unitOfWork.atomically(
      async () => await userRepo.get(data.id)
    );

    expect(user?.roles).toEqual(expect.arrayContaining(data.roles));
    expect(user?.id).toEqual(data.id);
    expect(user?.email).toEqual(data.email);
    expect(user?.passwordHash).toEqual(data.passwordHash);
  });

  it('can delete a user', async () => {
    const { userRepo, unitOfWork, userWriter } = await create();

    const data = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => await userWriter.save(data));
    await unitOfWork.atomically(async () => await userWriter.delete(data));

    const result = await unitOfWork.atomically(
      async () => await userRepo.get('ben')
    );

    expect(result).toEqual(undefined);
  });

  it('can update and return a user', async () => {
    const { userRepo, unitOfWork, userWriter } = await create();

    const data = User.reconstitute({
      email: 'bwainwright28@gmail.com',
      id: 'ben',
      passwordHash:
        '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
      roles: [],
    });

    await unitOfWork.atomically(async () => {
      await userWriter.save(data);
    });

    const user = await unitOfWork.atomically(
      async () => await userRepo.get(data.id)
    );

    expect(user).toEqual(data);
  });

  it('replaces role assignments when updating a user', async () => {
    const { userRepo, unitOfWork, userWriter, roleWriter } = await create();

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

    await unitOfWork.atomically(async () => {
      await roleWriter.save(adminRole);
      await roleWriter.save(viewerRole);
    });

    const originalUser = User.reconstitute({
      email: 'user@example.com',
      id: 'changing-roles',
      passwordHash: 'hash',
      roles: [adminRole.toObject()],
    });

    const updatedUser = User.reconstitute({
      ...originalUser.toObject(),
      roles: [viewerRole.toObject()],
    });

    await unitOfWork.atomically(async () => {
      await userWriter.save(originalUser);
    });

    await unitOfWork.atomically(async () => {
      await userWriter.update(updatedUser);
    });

    const retrieved = await unitOfWork.atomically(
      async () => await userRepo.get(updatedUser.id)
    );

    expect(retrieved?.roles).toEqual([viewerRole]);
    expect(retrieved?.roles).not.toEqual(originalUser.roles);
  });

  it('if someone tries to insert an email twice in a tx will fail due to uniqueness constraint and rollback the tx', async () => {
    const { userRepo, unitOfWork, userWriter } = await create();

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
      await unitOfWork.atomically(async () => {
        await userWriter.save(data);
        await userWriter.save(data2);
      });
    } catch {
      // This is fine - I just want ot make sure there is no users added
    }

    const user = await unitOfWork.atomically(
      async () => await userRepo.get(data.id)
    );

    expect(user).toEqual(undefined);
  });

  it('rolls back conflicting updates that violate unique email constraints', async () => {
    const { userRepo, unitOfWork, userWriter } = await create();

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

    await unitOfWork.atomically(async () => {
      await userWriter.save(userOne);
      await userWriter.save(userTwo);
    });

    const conflictingUserTwo = User.reconstitute({
      ...userTwo.toObject(),
      email: userOne.email,
    });

    try {
      await unitOfWork.atomically(async () => {
        await userWriter.save(conflictingUserTwo);
      });
    } catch {
      // This is fine, just want to catch the constraint failure
    }

    const persistedUserOne = await unitOfWork.atomically(
      async () => await userRepo.get(userOne.id)
    );

    const persistedUserTwo = await unitOfWork.atomically(
      async () => await userRepo.get(userTwo.id)
    );

    expect(persistedUserOne?.email).toBe(userOne.email);
    expect(persistedUserTwo?.email).toBe(userTwo.email);
  });

  describe('requireUser', () => {
    it('returns a user if present', async () => {
      const { userRepo, unitOfWork, userWriter } = await create();

      const data = User.reconstitute({
        email: 'bwainwright28@gmail.com',
        id: 'ben',
        passwordHash:
          '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
        roles: [],
      });

      await unitOfWork.atomically(async () => {
        await userWriter.save(data);
      });

      const user = await unitOfWork.atomically(
        async () => await userRepo.require('ben')
      );

      expect(user).toEqual(data);
    });

    it('throws if not present', async () => {
      const { userRepo, unitOfWork, userWriter } = await create();

      const data = User.reconstitute({
        email: 'bwainwright28@gmail.com',
        id: 'ben',
        passwordHash:
          '$argon2id$v=19$m=65536,t=2,p=1$n7G8BcbQsFanGrlBuFB/Y7dedcifW3P7brW8tyMwLsU$9Zdmy6ccSH6ABRNiP6SU+qKE0oYdqu5eexecCKyMDdk',
        roles: [],
      });

      await unitOfWork.atomically(async () => {
        await userWriter.save(data);
      });

      await expect(
        unitOfWork.atomically(async () => userRepo.require('another-user'))
      ).rejects.toThrow();
    });
  });

  describe('requireRole', () => {
    it('throws an error one is not present', async () => {
      const { roleRepo } = await create();

      await expect(roleRepo.require('viewer')).rejects.toThrow();
    });
    it('returns a role if one is present', async () => {
      const { roleRepo, unitOfWork, roleWriter } = await create();

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

      await unitOfWork.atomically(
        async () => await roleWriter.save(viewerRole)
      );

      expect(
        await unitOfWork.atomically(async () => roleRepo.require('viewer'))
      ).toEqual(viewerRole);
    });
  });

  describe('getMany', () => {
    it('can return many users', async () => {
      const { userRepo, unitOfWork, userWriter } = await create();

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

      await unitOfWork.atomically(async () => {
        await userWriter.save(data);
        await userWriter.save(data2);
        await userWriter.save(data3);
      });

      const users = await unitOfWork.atomically(
        async () => await userRepo.list({ start: 0, limit: 30 })
      );

      expect(users).toEqual(expect.arrayContaining([data, data2, data3]));
    });

    it('respects limits when returning many users', async () => {
      const { userRepo, unitOfWork, userWriter } = await create();

      const manyUsers = Array.from({ length: 45 }, (_, index) =>
        User.reconstitute({
          email: `bulk-${index}@example.com`,
          id: `bulk-${index}`,
          passwordHash: 'hash',
          roles: [],
        })
      );

      await unitOfWork.atomically(async () => {
        for (const user of manyUsers) {
          await userWriter.save(user);
        }
      });

      const offsetLimitedUsers = await unitOfWork.atomically(
        async () =>
          await userRepo.list({
            start: 40,
            limit: 10,
          })
      );

      expect(offsetLimitedUsers).toHaveLength(5);
      offsetLimitedUsers.forEach((user) =>
        expect(manyUsers.map((existing) => existing.id)).toContain(user.id)
      );
    });
  });

  it('returns undefined if not present', async () => {
    const { userRepo, unitOfWork } = await create();

    const user = await unitOfWork.atomically(async () => {
      await userRepo.get('foo');
    });

    expect(user).toBeUndefined();
  });
};
