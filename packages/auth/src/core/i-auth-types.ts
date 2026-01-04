import type { AuthBootstrapper } from '@bootstrap';
import type {
  ICurrentUserSetter,
  IPasswordHasher,
  IPasswordVerifier,
  IRoleRepository,
  IUserRepository,
} from '@ports';
import type { ConfigValue } from '@zero/bootstrap';

export interface IAuthPorts {
  UserRepository: IUserRepository;
  CurrentUserSetter: ICurrentUserSetter;
  PasswordHasher: IPasswordHasher;
  PasswordVerifier: IPasswordVerifier;
  RoleRepository: IRoleRepository;
  AdminEmailConfigValue: ConfigValue<string>;
  AdminPasswordConfigValue: ConfigValue<string>;
  AuthBootstrapper: AuthBootstrapper;
}
