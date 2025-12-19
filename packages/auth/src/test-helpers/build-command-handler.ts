import type { AbstractCommandHandler, ICommand } from '@zero/application-core';
import { containerWithAuthDepsMocked } from './container-with-auth-deps-mocked.ts';

export const buildCommandHandler = <
  THandler extends new (...args: any[]) => AbstractCommandHandler<
    ICommand<string>,
    string
  >
>(
  handler: THandler
) => {
  const result = containerWithAuthDepsMocked();
  result.container.bind('CommandHandler').to(handler);
  const resolvedHandler =
    result.container.get<InstanceType<THandler>>('CommandHandler');
  return { handler: resolvedHandler, ...result };
};
