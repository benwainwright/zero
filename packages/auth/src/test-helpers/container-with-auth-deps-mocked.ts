import { type IAuthTypes } from '@core';
import { TypedContainer } from '@inversifyjs/strongly-typed';
import {
  type ICurrentUserSetter,
  type IPasswordHasher,
  type IPasswordVerifier,
  type IRoleRepository,
  type IUserRepository,
} from '@ports';
import { type Mocked } from 'vitest';
import { mock } from 'vitest-mock-extended';
import { type IApplicationTypes, type IEventBus } from '@zero/application-core';
import { type IBootstrapTypes, type ILogger } from '@zero/bootstrap';

interface IMockContainer {
  container: TypedContainer<IAuthTypes & IApplicationTypes & IBootstrapTypes>;
  logger: Mocked<ILogger>;
  currentUserSetter: Mocked<ICurrentUserSetter>;
  userRepo: Mocked<IUserRepository>;
  passwordHasher: Mocked<IPasswordHasher>;
  passwordVerifier: Mocked<IPasswordVerifier>;
  roleRepo: Mocked<IRoleRepository>;
  eventBus: Mocked<IEventBus>;
}

export const containerWithAuthDepsMocked = (): IMockContainer => {
  const logger = mock<ILogger>();
  const userRepo = mock<IUserRepository>();
  const currentUserSetter = mock<ICurrentUserSetter>();
  const passwordHasher = mock<IPasswordHasher>();
  const passwordVerifier = mock<IPasswordVerifier>();
  const roleRepo = mock<IRoleRepository>();
  const eventBus = mock<IEventBus>();

  const container = new TypedContainer<
    IAuthTypes & IApplicationTypes & IBootstrapTypes
  >();

  container.bind('EventBus').toConstantValue(eventBus);
  container.bind('Logger').toConstantValue(logger);
  container.bind('UserRepository').toConstantValue(userRepo);
  container.bind('CurrentUserSetter').toConstantValue(currentUserSetter);
  container.bind('PasswordHasher').toConstantValue(passwordHasher);
  container.bind('PasswordVerifier').toConstantValue(passwordVerifier);
  container.bind('RoleRepository').toConstantValue(roleRepo);

  return {
    container,
    userRepo,
    currentUserSetter,
    passwordHasher,
    passwordVerifier,
    logger,
    eventBus,
    roleRepo,
  };
};
