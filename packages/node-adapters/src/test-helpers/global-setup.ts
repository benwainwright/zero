import { upAll, downAll, type IDockerComposeResult } from 'docker-compose';
import waitPort from 'wait-port';

import path from 'path';

export const setup = async () => {
  // oxlint-disable eslint/no-misused-promises
  await new Promise<IDockerComposeResult>((accept, reject) =>
    upAll({ cwd: path.join(__dirname, '..', '..'), log: true }).then(
      async (result) => {
        accept(result);
      },
      (err: unknown) => {
        if (err instanceof Error) {
          reject(err);
        }
      }
    )
  );
  await waitPort({ host: 'localhost', port: 4566 });
};

export const teardown = async () => {
  // oxlint-disable eslint/no-misused-promises
  await new Promise<IDockerComposeResult>((accept, reject) =>
    downAll({ cwd: path.join(__dirname, '..', '..'), log: true }).then(
      (result) => {
        accept(result);
      },
      (err: unknown) => {
        if (err instanceof Error) {
          reject(err);
        }
      }
    )
  );
};
