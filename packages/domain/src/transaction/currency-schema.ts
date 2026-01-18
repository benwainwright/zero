import z from 'zod';

export const currencySchema = z.union([
  z.literal('GBP'),
  z.literal('USD'),
  z.literal('EUR'),
]);

export type ICurrency = z.output<typeof currencySchema>;
