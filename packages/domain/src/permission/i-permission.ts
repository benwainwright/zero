import { capabilities, DomainModel } from '@core';

import z from 'zod';

export const permissionSchema = z.object({
  capabilities: z
    .array(z.union(capabilities.map((capability) => z.literal(capability))))
    .readonly(),
  action: z.union([z.literal('ALLOW'), z.literal(['DENY'])]),
  resource: z.union([z.instanceof(DomainModel), z.literal('*')]),
});

export type IPermission = z.output<typeof permissionSchema>;
