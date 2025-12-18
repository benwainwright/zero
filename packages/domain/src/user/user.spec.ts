import { type IActor } from '@core';
import { User } from './user.ts';
import { mock } from 'vitest-mock-extended';

describe('the user model', () => {
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
    it('calls grants.can correctly', () => {
      const user = User.reconstitute({
        id: 'foo',
        passwordHash: 'hash',
        email: 'a@b.c',
        roles: [],
      });

      user.update({ hash: 'foo' });
    });

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
    it('calls grant.can correctly', () => {
      const actor = mock<IActor>({ grants: mock() });

      const user = User.reconstitute({
        roles: [{ id: 'foo', permissions: [], name: 'foo' }],
        id: 'foo',
        passwordHash: 'hash',
        email: 'a@b.c',
      });

      user.delete(actor);

      expect(actor.grants.can).toHaveBeenCalledWith(user, 'user:delete');
    });

    it('raises an a delete event', () => {
      const actor = mock<IActor>({ grants: mock() });

      const user = User.reconstitute({
        roles: [{ id: 'foo', permissions: [], name: 'foo' }],
        id: 'foo',
        passwordHash: 'hash',
        email: 'a@b.c',
      });

      user.delete(actor);

      expect(user.pullEvents()).toEqual([
        {
          event: 'UserDeleted',
          data: user,
        },
      ]);
    });
  });
});
