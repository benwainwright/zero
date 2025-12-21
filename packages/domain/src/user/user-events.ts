import type { User } from './user.ts';

export interface IUserEvents {
  UserCreated: User;
  UserUpdated: { old: User; new: User };
  UserDeleted: User;
}
