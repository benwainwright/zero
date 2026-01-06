import z from 'zod';

export const accountSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  closed: z.boolean(),
  balance: z.number(),
  linkedOpenBankingAccount: z.string().optional(),
  deleted: z.boolean(),
  ownerId: z.string(),
});

export type IAccount = z.output<typeof accountSchema>;
