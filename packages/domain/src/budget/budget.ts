import { Category } from '@category';
import type { IBudget } from './i-budget.ts';
import type { ICategoryBalance } from './i-category-balance.ts';
import type { ICategoryMove } from './i-category-move.ts';

export class Budget {
  private readonly _description: string;
  private readonly _month: number;
  private readonly _year: number;

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

  private constructor(config: IBudget) {
    this._description = config.description;
    this._month = config.month;
    this._year = config.year;
    this.transactions = config.transactions;
    this.categoryBalances = new Map(Object.entries(config.initialBalances));
  }

  public static create(config: IBudget) {
    return new Budget(config);
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
