import type { IPasswordHasher, IRoleRepository, IUserRepository } from '@ports';

export interface IAuthTypes {
  UserRepository: IUserRepository;
  PasswordHasher: IPasswordHasher;
  RoleRepository: IRoleRepository;
}
