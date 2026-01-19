import z from 'zod';

export const openBankingTransactionSchema = z.object({
  transactionId: z.string().optional(),

  bookingDate: z.string().optional(),

  transactionAmount: z.object({
    currency: z.string(),
    amount: z.string(),
  }),

  valueDate: z.string().optional(),
  creditorName: z.string().optional(),
  debtorName: z.string().optional(),
});

export type IOpenBankingTransaction = z.output<
  typeof openBankingTransactionSchema
>;
