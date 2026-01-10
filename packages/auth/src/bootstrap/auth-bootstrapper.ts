import { ADMIN_USER_ID, USER_ROLE_ID } from '@constants';
import { inject } from '@core';
import type { IPasswordHasher, IRoleRepository, IUserRepository } from '@ports';
import type { IUnitOfWork, IWriteRepository } from '@zero/application-core';
import type { ConfigValue, ILogger } from '@zero/bootstrap';
import { Role, User } from '@zero/domain';
import { injectable } from 'inversify';
import { adminPermissions } from './admin-permissions.ts';
import { userPermissions } from './user-permissions.ts';

@injectable()
export class AuthBootstrapper {
  public constructor(
    @inject('Logger')
    private readonly logger: ILogger,

    @inject('UnitOfWork') private readonly unit: IUnitOfWork,
    @inject('UserRepository') private readonly users: IUserRepository,
    @inject('RoleRepository') private readonly roles: IRoleRepository,
    @inject('UserWriter') private readonly userWriter: IWriteRepository<User>,
    @inject('RoleWriter') private readonly roleWriter: IWriteRepository<Role>,

    @inject('AdminEmailConfigValue')
    private readonly adminEmail: ConfigValue<string>,

    @inject('AdminPasswordConfigValue')
    private readonly adminPassword: ConfigValue<string>,

    @inject('PasswordHasher')
    private readonly passwordHasher: IPasswordHasher
  ) {}

  public async bootstrap() {
    const password = await this.adminPassword.value;
    const adminEmail = await this.adminEmail.value;
    try {
      this.logger.info(`Bootstrapping users`);
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

      await this.unit.begin();
      const adminRoleIsPresent = Boolean(await this.roles.get(adminRole.id));
      await this.unit.commit();

      await this.unit.begin();
      const userRoleIsPresent = Boolean(await this.roles.get(userRole.id));
      await this.unit.commit();

      await this.unit.begin();
      const adminUserIsPresent = Boolean(await this.users.get(ADMIN_USER_ID));
      await this.unit.commit();

      await this.unit.begin();
      if (!adminRoleIsPresent) {
        await this.roleWriter.save(adminRole);
      }

      if (!userRoleIsPresent) {
        await this.roleWriter.save(userRole);
      }

      const bootstrapAdmin = User.reconstitute({
        id: 'admin',
        email: adminEmail,
        passwordHash: await this.passwordHasher.hashPassword(password),
        roles: [adminRole.toObject()],
      });

      if (!adminUserIsPresent) {
        await this.userWriter.save(bootstrapAdmin);
        this.logger.info(`Users bootstrapped`);
      }
      await this.unit.commit();
    } catch (error) {
      await this.unit.rollback();
      throw error;
    }
  }
}
