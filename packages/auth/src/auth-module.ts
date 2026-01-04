import { type IBootstrapTypes, type IModule } from '@zero/bootstrap';
import type { IApplicationTypes } from '@zero/application-core';
import {
  UserRepositoryAuthEventStager,
  AuthorisingCommandBus,
  AuthorisingQueryBus,
  GrantService,
  SessionStorage,
  type IAuthExports,
  type IAuthTypes,
} from '@core';
import { AuthBootstrapper } from '@bootstrap';
import { bindServices } from '@services';
import z from 'zod';

export const authModule: IModule<
  IApplicationTypes & IBootstrapTypes & IAuthTypes & IAuthExports
> = async ({
  logger,
  bind,
  configValue,
  decorate,
  onRequest,
  getAsync,
  onInit,
}) => {
  logger.info(`Initialising auth module`);

  bind('CurrentUserCache').to(SessionStorage).inRequestScope();
  bind('CurrentUserSetter').toService('CurrentUserCache');
  bind('SessionStore').toService('CurrentUserCache');

  const adminEmail = configValue({
    namespace: 'auth',
    key: 'adminEmail',
    schema: z.string(),
    description: 'Email address for bootstrap administrator account',
  });

  const adminPassword = configValue({
    namespace: 'auth',
    key: 'adminPassword',
    schema: z.string(),
    description: 'Password for bootstrap administrator account',
  });

  onInit(async () => {
    bind('AuthBootstrapper').to(AuthBootstrapper);
    bind('AdminEmailConfigValue').toConstantValue(adminEmail);
    bind('AdminPasswordConfigValue').toConstantValue(adminPassword);

    const authBootstrapper = await getAsync('AuthBootstrapper');
    await authBootstrapper.bootstrap();
  });

  bindServices(bind);

  onRequest(async (container) => {
    container.unbindSync('GrantService');
    container.bind('GrantService').to(GrantService).inRequestScope();
  });

  decorate('QueryBus', AuthorisingQueryBus);
  decorate('CommandBus', AuthorisingCommandBus);
  decorate('UserRepository', UserRepositoryAuthEventStager);
};
