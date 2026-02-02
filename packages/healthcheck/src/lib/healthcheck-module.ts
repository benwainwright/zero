import z from 'zod';

import type { IModule, IBootstrapTypes } from '@zero/bootstrap';
import { runHealthcheckServer } from './run-healthcheck-server.ts';

export const healthcheckModule: IModule<IBootstrapTypes> = async ({
  configValue,
  onInit,
  logger,
}) => {
  const healthcheckPort = configValue({
    namespace: 'healthcheck',
    description: 'Port for the healthcheck endpoint to listen on',
    key: 'port',
    schema: z.number(),
  });

  onInit(async () => {
    await runHealthcheckServer(healthcheckPort, logger);
  });
};
