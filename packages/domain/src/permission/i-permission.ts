import { capabilities } from './i-capability.ts';

import z from 'zod';

export const permissionSchema = z.object({
  capabilities: z.array(
    z.union([
      ...capabilities.map((capability) => z.literal(capability)),
      z.literal('all'),
    ])
  ),
  action: z.union([z.literal('ALLOW'), z.literal(['DENY'])]),
  resource: z.union([z.object({ id: z.string() }), z.literal('*')]),
});

export type IPermission = z.output<typeof permissionSchema>;
