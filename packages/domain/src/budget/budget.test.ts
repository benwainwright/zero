import { Category } from '@category';
import { Budget } from './budget.ts';
describe('the budget', () => {
  describe('getCategoryBalance', () => {
    it('returns the correct amounts for the ready to assign cat if there has been no txs', () => {
      const budget = Budget.create({
        description: '',
        month: 12,
        year: 2024,
        transactions: [],
        initialBalances: {
          [Category.ReadyToAssign.id]: {
            assigned: 150,
          },
        },
      });

      const balance = budget.getCategoryBalance(Category.ReadyToAssign);

      expect(balance).toEqual({ assigned: 150, remaining: 150 });
    });

    it('returns zero if no values are stored for the given category', () => {
      const budget = Budget.create({
        description: '',
        month: 12,
        year: 2024,
        transactions: [],
        initialBalances: {
          [Category.ReadyToAssign.id]: {
            assigned: 150,
          },
        },
      });

      const testCat = Category.reconstitute({
        id: '1',
        name: 'thing',
        description: 'other thing',
      });

      const balance = budget.getCategoryBalance(testCat);

      expect(balance).toEqual({ assigned: 0, remaining: 0 });
    });

    it('returns the aggregate total of all transactions assigned to a given category if no balance has been assigned to the cat', () => {
      const testCat = Category.reconstitute({
        id: '1',
        name: 'thing',
        description: 'other thing',
      });

      const transactions = [
        {
          amount: 100,
          categoryId: testCat.id,
        },
        {
          amount: -150,
          categoryId: testCat.id,
        },
        {
          amount: -24,
          categoryId: 'other',
        },
        {
          amount: -24,
          categoryId: 'other',
        },
        {
          amount: 12,
          categoryId: testCat.id,
        },
        {
          amount: -2,
          categoryId: testCat.id,
        },
      ];

      const budget = Budget.create({
        description: '',
        month: 12,
        year: 2024,
        transactions,
        initialBalances: {
          [Category.ReadyToAssign.id]: {
            assigned: 150,
          },
        },
      });

      const balance = budget.getCategoryBalance(testCat);

      expect(balance).toEqual({ assigned: 0, remaining: -40 });
    });

    it('combines the balances of the categories with the transactions if balances have been assigned', () => {
      const testCat = Category.reconstitute({
        id: '1',
        name: 'thing',
        description: 'other thing',
      });

      const testCatTwo = Category.reconstitute({
        id: '2',
        name: 'other-thing',
        description: 'fee',
      });

      const transactions = [
        {
          amount: 100,
          categoryId: testCat.id,
        },
        {
          amount: -150,
          categoryId: testCat.id,
        },
        {
          amount: 240,
          categoryId: testCatTwo.id,
        },
        {
          amount: 24,
          categoryId: testCatTwo.id,
        },
        {
          amount: 12,
          categoryId: testCat.id,
        },
        {
          amount: -2,
          categoryId: testCat.id,
        },
      ];

      const budget = Budget.create({
        description: '',
        month: 12,
        year: 2024,
        transactions,
        initialBalances: {
          [testCat.id]: {
            assigned: 43,
          },
          [testCatTwo.id]: {
            assigned: 150,
          },
        },
      });

      const testBalance = budget.getCategoryBalance(testCat);
      expect(testBalance).toEqual({ assigned: 43, remaining: 3 });

      const readyBalance = budget.getCategoryBalance(testCatTwo);
      expect(readyBalance).toEqual({ assigned: 150, remaining: 414 });
    });

    it('ready to assign txs combine with the initial ready to assign amounts', () => {
      const testCat = Category.reconstitute({
        id: '1',
        name: 'thing',
        description: 'other thing',
      });

      const testCatTwo = Category.reconstitute({
        id: '2',
        name: 'other-thing',
        description: 'fee',
      });

      const transactions = [
        {
          amount: 100,
          categoryId: testCat.id,
        },
        {
          amount: -150,
          categoryId: testCat.id,
        },
        {
          amount: 240,
          categoryId: testCatTwo.id,
        },
        {
          amount: 34,
          categoryId: Category.ReadyToAssign.id,
        },
        {
          amount: 24,
          categoryId: testCatTwo.id,
        },
        {
          amount: 12,
          categoryId: Category.ReadyToAssign.id,
        },
        {
          amount: 12,
          categoryId: testCat.id,
        },
        {
          amount: -2,
          categoryId: testCat.id,
        },
      ];

      const budget = Budget.create({
        description: '',
        month: 12,
        year: 2024,
        transactions,
        initialBalances: {
          [Category.ReadyToAssign.id]: {
            assigned: 100,
          },
        },
      });

      const readyToAssign = budget.getCategoryBalance(Category.ReadyToAssign);

      expect(readyToAssign).toEqual({
        assigned: 146,
        remaining: 146,
      });
    });

    it('transactions that come in with the ready to assign cat actually go into the ready to assign assigned balance', () => {
      const testCat = Category.reconstitute({
        id: '1',
        name: 'thing',
        description: 'other thing',
      });

      const testCatTwo = Category.reconstitute({
        id: '2',
        name: 'other-thing',
        description: 'fee',
      });

      const transactions = [
        {
          amount: 100,
          categoryId: testCat.id,
        },
        {
          amount: -150,
          categoryId: testCat.id,
        },
        {
          amount: 240,
          categoryId: testCatTwo.id,
        },
        {
          amount: 34,
          categoryId: Category.ReadyToAssign.id,
        },
        {
          amount: 24,
          categoryId: testCatTwo.id,
        },
        {
          amount: 12,
          categoryId: Category.ReadyToAssign.id,
        },
        {
          amount: 12,
          categoryId: testCat.id,
        },
        {
          amount: -2,
          categoryId: testCat.id,
        },
      ];

      const budget = Budget.create({
        description: '',
        month: 12,
        year: 2024,
        transactions,
        initialBalances: {
          [testCat.id]: {
            assigned: 43,
          },
          [testCatTwo.id]: {
            assigned: 150,
          },
        },
      });

      const readyToAssign = budget.getCategoryBalance(Category.ReadyToAssign);

      expect(readyToAssign).toEqual({
        assigned: 46,
        remaining: 46,
      });
    });
  });

  describe('move category balance', () => {
    it('does not effect the getInitialBalance method', () => {
      const testCat = Category.reconstitute({
        id: '1',
        name: 'thing',
        description: 'other thing',
      });

      const testCatTwo = Category.reconstitute({
        id: '2',
        name: 'other-thing',
        description: 'fee',
      });
      const budget = Budget.create({
        description: '',
        month: 12,
        year: 2024,
        transactions: [],
        initialBalances: {
          [testCat.id]: {
            assigned: 43,
          },
          [testCatTwo.id]: {
            assigned: 150,
          },
        },
      });

      budget.moveFrom(testCat, testCatTwo, 12);

      const balance = budget.getInitialCategoryBalance(testCat);
      expect(balance.assigned).toEqual(43);

      const balance2 = budget.getInitialCategoryBalance(testCatTwo);
      expect(balance2.assigned).toEqual(150);
    });

    it('results in the assigened category balance switching', () => {
      const testCat = Category.reconstitute({
        id: '1',
        name: 'thing',
        description: 'other thing',
      });

      const testCatTwo = Category.reconstitute({
        id: '2',
        name: 'other-thing',
        description: 'fee',
      });
      const budget = Budget.create({
        description: '',
        month: 12,
        year: 2024,
        transactions: [],
        initialBalances: {
          [testCat.id]: {
            assigned: 43,
          },
          [testCatTwo.id]: {
            assigned: 150,
          },
        },
      });

      budget.moveFrom(testCat, testCatTwo, 12);

      const balance = budget.getCategoryBalance(testCat);
      expect(balance.assigned).toEqual(31);

      const balance2 = budget.getCategoryBalance(testCatTwo);
      expect(balance2.assigned).toEqual(162);
    });
  });
});
