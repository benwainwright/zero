import z from 'zod';

export const routes = [
  'home',
  'register',
  'login',
  'logout',
  'users',
  'editUser',
] as const;

export const routesSchema = z
  .array(
    z.union([...routes.map((route) => z.literal(route)), z.literal('all')])
  )
  .readonly();

export type IRoute = z.output<typeof routesSchema>[number];
