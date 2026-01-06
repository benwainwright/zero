import z from 'zod';

export const bankConnectionSchema = z.object({
  id: z.string(),
  bankName: z.string(),
  logo: z.string(),
  requisitionId: z.string().optional(),
  accounts: z.array(z.string()).optional(),
  ownerId: z.string(),
});

export type IBankConnection = z.output<typeof bankConnectionSchema>;
