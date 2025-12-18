import type {
  ICurrentUserSetter,
  IPasswordHasher,
  IPasswordVerifier,
  IRoleRepository,
  IUserRepository,
} from '@ports';

export interface IAuthTypes {
  UserRepository: IUserRepository;
  CurrentUserSetter: ICurrentUserSetter;
  PasswordHasher: IPasswordHasher;
  PasswordVerifier: IPasswordVerifier;
  RoleRepository: IRoleRepository;
}
