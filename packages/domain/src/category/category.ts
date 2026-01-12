import { DomainModel, type IOwnedBy } from '@core';
import { categorySchema, type ICategory } from './i-category.ts';

export class Category
  extends DomainModel<ICategory>
  implements ICategory, IOwnedBy
{
  public static key = 'category';

  public readonly id: string;
  public _name: string;
  public _description: string | undefined;

  private constructor(config: ICategory) {
    super();
    this.id = config.id;
    this._name = config.name;
    this._description = config.description;
    this.ownerId = config.ownerId;
  }
  public readonly ownerId: string;

  public static reconstitute(config: ICategory) {
    return new Category(config);
  }

  public static create(config: ICategory) {
    const theCat = new Category(categorySchema.parse(config));
    theCat.raiseEvent({
      event: 'CategoryCreatedEvent',
      data: Category.reconstitute(theCat),
    });

    return theCat;
  }

  public get name() {
    return this._name;
  }

  public get description() {
    return this._description;
  }

  public static ReadyToAssign = Category.reconstitute({
    id: '0',
    name: 'Ready to assign',
    ownerId: 'system',
    description:
      'Special category that indicates that a transaction consists of funds that should be assigned to other categories',
  });

  public update(config: Partial<{ name: string; description: string }>) {
    const old = Category.reconstitute(this);
    this._name = config.name ?? this._name;
    this._description = config.description ?? this._description;

    this.raiseEvent({
      event: 'CategoryUpdatedEvent',
      data: { old, new: Category.reconstitute(this) },
    });
  }

  public delete() {
    this.raiseEvent({
      event: 'CategoryDeletedEvent',
      data: Category.reconstitute(this),
    });
  }

  public override toObject(): ICategory {
    return {
      ownerId: this.ownerId,
      id: this.id,
      name: this.name,
      description: this.description,
    };
  }
}
