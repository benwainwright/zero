import type { ConfigValue, ILogger } from '@zero/bootstrap';
import express from 'express';

export const runHealthcheckServer = async (
  serverPort: ConfigValue<number>,
  logger: ILogger
) => {
  const app = express();
  const port = await serverPort.value;

  app.get('/healthcheck', (_req, res) => {
    res.json({
      status: 'ok',
    });
  });

  app.listen(port, () => {
    logger.info(`Healthcheck listening on port ${port}`);
  });
};
