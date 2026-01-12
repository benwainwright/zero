import z from 'zod';

export const routes = [
  'home',
  'accountTransactions',
  'accounts',
  'bankConnection',
  'register',
  'login',
  'logout',
  'roles',
  'users',
  'editUser',
  'categories',
  'editRole',
  'all',
] as const;

export const routesSchema = z.array(
  z.union(routes.map((route) => z.literal(route)))
);

export type IRoute = z.output<typeof routesSchema>[number];
