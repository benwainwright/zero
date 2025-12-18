import z from 'zod';
import { roleSchema } from '@role';

export const userSchema = z.object({
  id: z.string().readonly(),
  passwordHash: z.string().readonly(),
  email: z.string().readonly(),
  roles: z.array(roleSchema),
});

export type IUser = z.output<typeof userSchema>;
