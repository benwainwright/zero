import z from 'zod';

const sharedTransactionItems = {
  transactionId: z.string().optional,

  bookingDate: z
    .string()
    .optional()
    .transform((item) => (item ? new Date(item) : item)),

  transactionAmount: z.object({
    currency: z.string(),
    amount: z.number(),
  }),

  valueDate: z
    .string()
    .optional()
    .transform((item) => (item ? new Date(item) : item)),
};

export const openBankingCreditTransactionSchema = z.object({
  creditorName: z.string().optional(),
  ...sharedTransactionItems,
});

export const openBankingDebitTransactionSchema = z.object({
  debtorName: z.string().optional(),
  ...sharedTransactionItems,
});

export const openBankingTransactionSchema = z.union([
  openBankingCreditTransactionSchema,
  openBankingDebitTransactionSchema,
]);

export type IOpenBankingTransaction = z.output<
  typeof openBankingTransactionSchema
>;
