import type { RouteSpec } from '@config';
import type { IRoute, User } from '@zero/domain';

export const routeAvailable = (
  user: User | undefined,
  routeSpec: RouteSpec,
  route: IRoute
) => {
  if (!user && (routeSpec.public || routeSpec.publicOnly)) {
    return true;
  }

  if (user && !routeSpec.publicOnly && user.canView(route)) {
    return true;
  }

  return false;
};
