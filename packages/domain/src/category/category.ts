import { DomainModel, type IOwnedBy } from '@core';
import type { ICategory } from './i-category.ts';

export class Category
  extends DomainModel<ICategory>
  implements ICategory, IOwnedBy
{
  public static key = 'category';

  private constructor(config: ICategory) {
    super();
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
    this.ownerId = config.ownerId;
  }
  public readonly ownerId: string;

  public static reconstitute(config: ICategory) {
    return new Category(config);
  }

  public static create(config: ICategory) {
    return new Category(config);
  }

  public readonly id: string;
  public readonly name: string;
  public readonly description: string;

  public static ReadyToAssign = Category.reconstitute({
    id: '0',
    name: 'Ready to assign',
    ownerId: 'system',
    description:
      'Special category that indicates that a transaction consists of funds that should be assigned to other categories',
  });

  public override toObject(): ICategory {
    return {
      ownerId: this.ownerId,
      id: this.id,
      name: this.name,
      description: this.description,
    };
  }
}
