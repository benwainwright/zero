import type { Category } from '../category/category.ts';

export interface ICategoryMove {
  from: Category;
  to: Category;
  date: Date;
  amount: number;
}
