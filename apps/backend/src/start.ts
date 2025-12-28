import { applicationCoreModule } from '@zero/application-core';
import { bootstrapModule, type IBootstrapTypes } from '@zero/bootstrap';

import { TypedContainer } from '@inversifyjs/strongly-typed';
import { authModule } from '@zero/auth';
import { sqliteAdaptersModule } from '@zero/sqlite-adapters';
import { websocketServerModule } from '@zero/websocket-server-adapter/server';

const start = async () => {
  const container = new TypedContainer<IBootstrapTypes>({
    defaultScope: 'Request',
  });

  container.bind('Container').toConstantValue(container);

  await container.load(bootstrapModule);
  await container.load(applicationCoreModule);
  await container.load(authModule);
  await container.load(sqliteAdaptersModule);
  await container.load(websocketServerModule);

  const bootstrapper = await container.getAsync('Bootstrapper');

  await bootstrapper.start();
};

start().catch((error: unknown) => {
  console.log(error);
});
