import type { User } from './user.ts';

export interface UserEvents {
  UserCreated: User;
  UserUpdated: { old: User; new: User };
  UserDeleted: User;
}
