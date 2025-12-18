import type { TypedContainer } from '@inversifyjs/strongly-typed';
import { Role, User } from '@zero/domain';
import type { IAuthTypes } from './i-auth-types.ts';
import type { IBootstrapper } from '@zero/bootstrap';
import z from 'zod';

export const bootstrapAdminUser = (
  bootstrapper: IBootstrapper,
  container: TypedContainer<IAuthTypes>
) => {
  const adminEmail = bootstrapper.configValue('adminEmail', z.string());
  const adminPassword = bootstrapper.configValue('adminPassword', z.string());
  bootstrapper.addInitStep(async () => {
    const adminRole = Role.reconstitute({
      id: 'admin',
      name: 'Admin',
      permissions: [],
    });

    const roleRepo = await container.getAsync('RoleRepository');
    await roleRepo.save(adminRole);

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
    await userRepo.save(bootstrapAdmin);
  });
};
