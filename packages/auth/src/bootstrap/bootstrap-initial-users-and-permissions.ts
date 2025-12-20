import type { TypedContainer } from '@inversifyjs/strongly-typed';
import { Role, User } from '@zero/domain';
import type { IAuthTypes } from '@core';
import type { IBootstrapper } from '@zero/bootstrap';
import z from 'zod';
import { adminPermissions } from './admin-permissions.ts';
import { ADMIN_USER_ID, USER_ROLE_ID } from '@constants';
import { userPermissions } from './user-permissions.ts';

export const bootstrapInitialUsersAndPermissions = (
  bootstrapper: IBootstrapper,
  container: TypedContainer<IAuthTypes>
) => {
  const adminEmail = bootstrapper.configValue({
    namespace: 'auth',
    key: 'adminEmail',
    schema: z.string(),
    description: 'Email address for the bootstrap administrator account',
  });

  const adminPassword = bootstrapper.configValue({
    namespace: 'auth',
    key: 'adminPassword',
    schema: z.string(),
    description: 'Password for the bootstrap administrator account',
  });

  bootstrapper.addInitStep(async () => {
    const adminRole = Role.reconstitute({
      id: ADMIN_USER_ID,
      name: 'Admin',
      permissions: adminPermissions,
    });

    const userRole = Role.reconstitute({
      id: USER_ROLE_ID,
      name: 'User',
      permissions: userPermissions,
    });

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
  });
};
