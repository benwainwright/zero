import type { AbstractQueryHandler, IQuery } from '@zero/application-core';
import { containerWithAuthDepsMocked } from './container-with-auth-deps-mocked.ts';

export const buildQueryHandler = <
  THandler extends new (...args: any[]) => AbstractQueryHandler<
    IQuery<string>,
    string
  >
>(
  handler: THandler
) => {
  const result = containerWithAuthDepsMocked();
  result.container.bind('QueryHandler').to(handler);
  const resolvedHandler =
    result.container.get<InstanceType<THandler>>('QueryHandler');
  return { handler: resolvedHandler, ...result };
};
