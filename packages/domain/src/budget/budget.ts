import { Category } from '@category';
import type { IBudget } from './i-budget.ts';
import type { ICategoryBalance } from './i-category-balance.ts';
import type { ICategoryMove } from './i-category-move.ts';
import { DomainModel, type IOwnedBy } from '@core';

export class Budget extends DomainModel<IBudget> implements IOwnedBy {
  private constructor(config: IBudget) {
    super();
    this.id = config.id;
    this._description = config.description;
    this._month = config.month;
    this._year = config.year;
    this.transactions = config.transactions;
    this.ownerId = config.ownerId;
    this.categoryBalances = new Map(Object.entries(config.initialBalances));
  }

  public readonly ownerId: string;

  public static create(config: IBudget) {
    return new Budget(config);
  }

  public static reconstitute(config: IBudget) {
    return new Budget(config);
  }

  public override toObject(): IBudget {
    const categoryBalances: Record<string, { assigned: number }> = {};
    for (const [key, value] of this.categoryBalances) {
      categoryBalances[key] = value;
    }
    return {
      ownerId: this.ownerId,
      description: this.description,
      initialBalances: categoryBalances,
      transactions: this.transactions,
      id: this.id,
      month: this.month,
      year: this.year,
    };
  }

  public static key = 'budget';

  private readonly _description: string;
  private readonly _month: number;
  private readonly _year: number;
  public readonly id: string;

  private readonly transactions: { amount: number; categoryId: string }[];

  private categoryBalances = new Map<
    string,
    Omit<ICategoryBalance, 'remaining'>
  >();

  private categoryMoves: ICategoryMove[] = [];

  public get month() {
    return this._month;
  }

  public get year() {
    return this._year;
  }

  public get description() {
    return this._description;
  }

  public moveFrom(from: Category, to: Category, amount: number) {
    this.categoryMoves.push({
      from,
      to,
      amount,
      date: new Date(),
    });
  }

  private getCategoryTransactionsSum(category: Category) {
    const remaining = this.transactions.filter(
      (transaction) => transaction.categoryId === category.id
    );

    return remaining.reduce((sum, transaction) => transaction.amount + sum, 0);
  }

  private getAssignedBalance(category: Category) {
    const balance = this.categoryBalances.get(category.id)?.assigned ?? 0;

    const actualBalance = this.isReadyToAssign(category)
      ? balance + this.getCategoryTransactionsSum(category)
      : balance;

    const froms = this.categoryMoves
      .filter((move) => move.from.id === category.id)
      .reduce((sum, move) => sum + move.amount, 0);

    const tos = this.categoryMoves
      .filter((move) => move.to.id === category.id)
      .reduce((sum, move) => sum + move.amount, 0);

    return actualBalance - froms + tos;
  }

  public getInitialCategoryBalance(category: Category): { assigned: number } {
    const assigned = this.categoryBalances.get(category.id)?.assigned ?? 0;
    return { assigned };
  }

  private isReadyToAssign(category: Category) {
    return Category.ReadyToAssign.id === category.id;
  }

  public getCategoryBalance(category: Category): ICategoryBalance {
    const categorySum = this.getCategoryTransactionsSum(category);
    const assigned = this.getAssignedBalance(category);
    const remaining =
      assigned + (this.isReadyToAssign(category) ? 0 : categorySum);

    return {
      assigned,
      remaining,
    };
  }
}
