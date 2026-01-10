import type { AuthBootstrapper } from '@bootstrap';
import type {
  ICurrentUserSetter,
  IPasswordHasher,
  IPasswordVerifier,
  IRoleRepository,
  IUserRepository,
} from '@ports';
import type { IWriteRepository } from '@zero/application-core';
import type { ConfigValue } from '@zero/bootstrap';
import type { Role, User } from '@zero/domain';

export interface IAuthPorts {
  UserRepository: IUserRepository;
  UserWriter: IWriteRepository<User>;
  CurrentUserSetter: ICurrentUserSetter;
  PasswordHasher: IPasswordHasher;
  PasswordVerifier: IPasswordVerifier;
  RoleRepository: IRoleRepository;
  RoleWriter: IWriteRepository<Role>;
  AdminEmailConfigValue: ConfigValue<string>;
  AdminPasswordConfigValue: ConfigValue<string>;
  AuthBootstrapper: AuthBootstrapper;
}
