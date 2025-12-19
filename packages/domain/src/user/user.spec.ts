import { Role, type IRole } from '@role';
import { User } from './user.ts';
import type { IPermission } from '@permission';

describe('the user model', () => {
  describe('the email getter', () => {
    it('works', () => {
      const mockRoleTwo: IRole = {
        id: 'bar',
        permissions: [],
        name: 'baz',
      };

      const user = User.reconstitute({
        id: 'foo',
        passwordHash: 'hash',
        email: 'a@b.c',
        roles: [mockRoleTwo],
      });

      expect(user.email).toEqual('a@b.c');
    });
  });
  describe('the passwordHash getter', () => {
    it('works', () => {
      const mockRoleTwo: IRole = {
        id: 'bar',
        permissions: [],
        name: 'baz',
      };

      const user = User.reconstitute({
        id: 'foo',
        passwordHash: 'hash',
        email: 'a@b.c',
        roles: [mockRoleTwo],
      });

      expect(user.passwordHash).toEqual('hash');
    });
  });
  describe('the role getter', () => {
    it('works', () => {
      const mockRoleTwo: IRole = {
        id: 'bar',
        permissions: [],
        name: 'baz',
      };

      const user = User.reconstitute({
        id: 'foo',
        passwordHash: 'hash',
        email: 'a@b.c',
        roles: [mockRoleTwo],
      });

      expect(user.roles).toEqual([Role.reconstitute(mockRoleTwo)]);
    });
  });
  describe('permissions', () => {
    it('are extracted from the role', () => {
      const permOne: IPermission[] = [
        {
          resource: '*',
          capabilities: ['user:read'],
          action: 'ALLOW',
        },
      ];

      const permTwo: IPermission[] = [
        {
          resource: '*',
          capabilities: ['user:delete'],
          action: 'DENY',
        },
      ];

      const mockRole: IRole = {
        permissions: permOne,
        id: 'foo',
        name: 'foo',
      };

      const mockRoleTwo: IRole = {
        id: 'bar',
        permissions: permTwo,
        name: 'baz',
      };

      const user = User.reconstitute({
        id: 'foo',
        passwordHash: 'hash',
        email: 'a@b.c',
        roles: [mockRole, mockRoleTwo],
      });

      expect(user.permissions).toEqual([...permOne, ...permTwo]);
    });
  });

  describe('freeze dry', () => {
    it('returns an object version of the user without the password hash if secure is false', () => {
      const user = User.reconstitute({
        id: 'foo',
        passwordHash: 'hash',
        email: 'a@b.c',
        roles: [],
      });

      const dried = user.toObject();

      expect(dried).not.toEqual(User);

      expect(dried).toEqual({
        id: 'foo',
        passwordHash: '',
        email: 'a@b.c',
        roles: [],
      });
    });

    it('returns an object version of the user with the password hash if secure is true', () => {
      const user = User.reconstitute({
        id: 'foo',
        passwordHash: 'hash',
        email: 'a@b.c',
        roles: [],
      });

      const dried = user.toObject({ secure: true });

      expect(dried).not.toEqual(User);
      expect(dried).toEqual({
        id: 'foo',
        passwordHash: 'hash',
        email: 'a@b.c',
        roles: [],
      });
    });
  });

  describe('create', () => {
    it('raises an a create event', () => {
      const user = User.create({
        id: 'foo',
        passwordHash: 'hash',
        email: 'a@b.c',
        roles: [],
      });

      expect(user.pullEvents()).toEqual([
        {
          event: 'UserCreated',
          data: user,
        },
      ]);
    });
  });

  describe('update', () => {
    it('raises a domain event', () => {
      const user = User.reconstitute({
        id: 'foo',
        passwordHash: 'hash',
        email: 'a@b.c',
        roles: [],
      });

      user.update({ hash: 'foo' });

      expect(user.pullEvents()).toEqual([
        {
          event: 'UserUpdated',
          data: {
            old: User.reconstitute({
              roles: [],
              id: 'foo',
              passwordHash: 'hash',
              email: 'a@b.c',
            }),
            new: User.reconstitute({
              roles: [],
              id: 'foo',
              passwordHash: 'foo',
              email: 'a@b.c',
            }),
          },
        },
      ]);
    });
  });

  describe('delete', () => {
    it('raises an a delete event', () => {
      const user = User.reconstitute({
        roles: [{ id: 'foo', permissions: [], name: 'foo' }],
        id: 'foo',
        passwordHash: 'hash',
        email: 'a@b.c',
      });

      user.delete();

      expect(user.pullEvents()).toEqual([
        {
          event: 'UserDeleted',
          data: user,
        },
      ]);
    });
  });
});
