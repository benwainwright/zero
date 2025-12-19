import type {
  ICurrentUserSetter,
  IPasswordHasher,
  IPasswordVerifier,
  IRoleRepository,
  IUserRepository,
} from '@ports';

export interface IAuthPorts {
  UserRepository: IUserRepository;
  CurrentUserSetter: ICurrentUserSetter;
  PasswordHasher: IPasswordHasher;
  PasswordVerifier: IPasswordVerifier;
  RoleRepository: IRoleRepository;
}
