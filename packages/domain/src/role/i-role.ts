import { permissionSchema } from '@permission';
import z from 'zod';

export const roleSchema = z.object({
  id: z.string(),
  name: z.string(),
  permissions: z.array(permissionSchema),
});

export type IRole = z.output<typeof roleSchema>;
