import z from 'zod';

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  ownerId: z.string(),
});

export type ICategory = z.output<typeof categorySchema>;
