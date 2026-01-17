import { Category, categorySchema } from '@category';
import z from 'zod';

export type ITransaction = z.output<typeof transactionSchema>;

export const transactionSchema = z.object({
  id: z.string(),
  accountId: z.string(),
  ownerId: z.string(),
  pending: z.boolean(),
  date: z
    .union([z.date(), z.string()])
    .transform((date) => (typeof date === 'string' ? new Date(date) : date)),

  payee: z.string(),
  amount: z.number(),
  currency: z.union([z.literal('GBP')]),
  category: categorySchema
    .transform((item) => Category.reconstitute(item))
    .optional(),
});
