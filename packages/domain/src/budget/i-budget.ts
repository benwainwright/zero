import z from 'zod';

export const budgetSchema = z.object({
  description: z.string(),
  month: z.number(),
  year: z.number(),
  transactions: z.array(
    z.object({ amount: z.number(), categoryId: z.string() })
  ),
  initialBalances: z.record(z.string(), z.object({ assigned: z.number() })),
  id: z.string(),
  ownerId: z.string(),
});

export type IBudget = z.output<typeof budgetSchema>;
