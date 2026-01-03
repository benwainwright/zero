import type { TypedContainer } from '@inversifyjs/strongly-typed';
import { Role, User } from '@zero/domain';
import type { IAuthTypes } from '@core';
import type { IBootstrapper, ILogger } from '@zero/bootstrap';
import z from 'zod';
import { adminPermissions } from './admin-permissions.ts';
import { ADMIN_USER_ID, USER_ROLE_ID } from '@constants';
import { userPermissions } from './user-permissions.ts';
import type { IApplicationTypes } from '@zero/application-core';

export const bootstrapInitialUsersAndPermissions = (
  logger: ILogger,
  bootstrapper: IBootstrapper,
  container: TypedContainer<IAuthTypes & IApplicationTypes>
) => {
  logger.info(`Bootstrapping initial users if they arent present`);
  const adminEmail = bootstrapper.configValue({
    namespace: 'auth',
    key: 'adminEmail',
    schema: z.string(),
    description: 'Email address for bootstrap administrator account',
  });

  const adminPassword = bootstrapper.configValue({
    namespace: 'auth',
    key: 'adminPassword',
    schema: z.string(),
    description: 'Password for bootstrap administrator account',
  });

  bootstrapper.addInitStep(async () => {
    const adminRole = Role.reconstitute({
      id: ADMIN_USER_ID,
      routes: ['all'],
      name: 'Admin',
      permissions: adminPermissions,
    });

    const userRole = Role.reconstitute({
      routes: ['home', 'register', 'login', 'logout'],
      id: USER_ROLE_ID,
      name: 'User',
      permissions: userPermissions,
    });

    const unitOfWork = await container.getAsync('UnitOfWork');
    await unitOfWork.begin();
    const roleRepo = await container.getAsync('RoleRepository');
    await roleRepo.saveRole(adminRole);
    await roleRepo.saveRole(userRole);

    const userRepo = await container.getAsync('UserRepository');
    const passwordHasher = await container.getAsync('PasswordHasher');

    const bootstrapAdmin = User.reconstitute({
      id: 'admin',
      email: await adminEmail.value,
      passwordHash: await passwordHasher.hashPassword(
        await adminPassword.value
      ),
      roles: [adminRole.toObject()],
    });
    await userRepo.saveUser(bootstrapAdmin);
    await unitOfWork.commit();
    logger.info(`Users bootstrapped`);
  });
};
