import { Category } from '@category';

describe('the category entity', () => {
  describe('delete', () => {
    it('raises an event', () => {
      const theCat = Category.reconstitute({
        id: 'foo',
        name: 'bar',
        description: 'baz',
        ownerId: 'ben',
      });

      theCat.delete();

      expect(theCat.pullEvents()).toEqual([
        {
          event: 'CategoryDeletedEvent',
          data: Category.reconstitute({
            id: 'foo',
            name: 'bar',
            description: 'baz',
            ownerId: 'ben',
          }),
        },
      ]);
    });
  });

  describe('create', () => {
    it('creates a new category and raises an event', () => {
      const newCat = Category.create({
        id: 'foo',
        name: 'bar',
        description: 'baz',
        ownerId: 'ben',
      });
      expect(newCat).toBeInstanceOf(Category);

      expect(newCat.pullEvents()).toEqual([
        {
          event: 'CategoryCreatedEvent',
          data: Category.reconstitute({
            id: 'foo',
            name: 'bar',
            description: 'baz',
            ownerId: 'ben',
          }),
        },
      ]);
    });
  });

  describe('update', () => {
    it('updates the name and description and raises an event', () => {
      const theCat = Category.reconstitute({
        id: 'foo',
        name: 'bar',
        description: 'baz',
        ownerId: 'ben',
      });

      theCat.update({ name: 'bop' });

      expect(theCat.name).toEqual('bop');
      expect(theCat.description).toEqual('baz');

      expect(theCat.pullEvents()).toEqual([
        {
          event: 'CategoryUpdatedEvent',
          data: {
            old: Category.reconstitute({
              id: 'foo',
              name: 'bar',
              description: 'baz',
              ownerId: 'ben',
            }),
            new: Category.reconstitute({
              id: 'foo',
              name: 'bop',
              description: 'baz',
              ownerId: 'ben',
            }),
          },
        },
      ]);

      theCat.update({ description: 'blimp' });

      expect(theCat.name).toEqual('bop');
      expect(theCat.description).toEqual('blimp');

      expect(theCat.pullEvents()).toEqual([
        {
          event: 'CategoryUpdatedEvent',
          data: {
            old: Category.reconstitute({
              id: 'foo',
              description: 'baz',
              name: 'bop',
              ownerId: 'ben',
            }),
            new: Category.reconstitute({
              id: 'foo',
              name: 'bop',
              description: 'blimp',
              ownerId: 'ben',
            }),
          },
        },
      ]);
    });
  });
});
