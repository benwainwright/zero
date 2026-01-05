import { DomainModel } from '@core';
import type { ICategory } from './i-category.ts';

export class Category extends DomainModel<ICategory> implements ICategory {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;

  public static ReadyToAssign = Category.reconstitute({
    id: '0',
    name: 'Ready to assign',
    description:
      'Special category that indicates that a transaction consists of funds that should be assigned to other categories',
  });

  private constructor(config: ICategory) {
    super();
    this.id = config.id;
    this.name = config.name;
    this.description = config.description;
  }

  public static reconstitute(config: ICategory) {
    return new Category(config);
  }

  public static create(config: ICategory) {
    return new Category(config);
  }

  public override toObject(): ICategory {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
    };
  }
}
