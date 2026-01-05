import z from 'zod';

export const categoryBalanceSchema = z.object({
  remaining: z.number(),
  assigned: z.number(),
});

export type ICategoryBalance = z.output<typeof categoryBalanceSchema>;
