import { permissionSchema } from '@permission';
import z from 'zod';
import { routesSchema } from './i-route.ts';

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.array(permissionSchema),
  routes: routesSchema,
});

export type IRole = z.output<typeof roleSchema>;
