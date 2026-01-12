import { Category } from '@category';

export interface CategoryEvents {
  CategoryDeletedEvent: Category;
  CategoryCreatedEvent: Category;
  CategoryUpdatedEvent: { old: Category; new: Category };
}
