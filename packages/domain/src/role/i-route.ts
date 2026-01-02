import z from 'zod';

export const routes = [
  'home',
  'register',
  'login',
  'logout',
  'roles',
  'users',
  'editUser',
  'editRole',
  'all',
] as const;

export const routesSchema = z
  .array(z.union(routes.map((route) => z.literal(route))))
  .readonly();

export type IRoute = z.output<typeof routesSchema>[number];
