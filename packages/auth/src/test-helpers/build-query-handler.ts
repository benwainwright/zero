import type { AbstractQueryHandler, IQuery } from '@zero/application-core';
import { containerWithAuthDepsMocked } from './container-with-auth-deps-mocked.ts';

export const buildQueryHandler = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
