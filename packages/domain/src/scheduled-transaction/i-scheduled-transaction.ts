import z from 'zod';

export const scheduledTransaction = z.object({
  id: z.string(),
  when: z.string(),
});

export type IScheduledTransaction = z.output<typeof scheduledTransaction>;
