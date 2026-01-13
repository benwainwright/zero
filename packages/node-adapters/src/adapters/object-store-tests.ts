import type { IObjectStorage } from '@zero/application-core';

export const objectStoreTests = (create: () => Promise<IObjectStorage>) => {
  describe.sequential('listKeys', () => {
    it('returns a list of all the keys in a given namespace', async () => {
      const store = await create();

      await store.set('foo', 'bar', 'test-1');
      await store.set('foo', 'bash', 'test-2');
      await store.set('foo', 'bip', 'test-3');

      const keys = await store.listKeys('foo');
      expect(keys).toEqual(['bar', 'bash', 'bip']);
    });

    it('returns an empty array if there is no namespace', async () => {
      const store = await create();
      const keys = await store.listKeys('foo');
      expect(keys).toEqual([]);
    });
  });

  describe('get and set', () => {
    it('returns undefined if there was no namespace', async () => {
      const store = await create();
      const result = await store.get('bop', 'bar');

      expect(result).toEqual(undefined);
    });

    it('returns undefined if there is no file in the first place', async () => {
      const store = await create();

      await store.set('foo', 'bip', 'test');
      const result = await store.get('foo', 'bar');

      expect(result).toEqual(undefined);
    });

    it('undefined results in objects returning undefined', async () => {
      const store = await create();

      const text = 'hello!';

      await store.set('foo', 'bar', text);
      await store.set('foo', 'bar', undefined);

      const result = await store.get('foo', 'bar');
      expect(result).toEqual(undefined);
    });

    it('can set and retrieve objects', async () => {
      const store = await create();

      const text = 'hello!';

      await store.set('foo', 'bar', text);

      const result = await store.get('foo', 'bar');
      expect(result).toEqual(text);
    });

    it('doesnt retrieve objects from a different namespace', async () => {
      const store = await create();

      const text = 'hello!';

      await store.set('foo', 'bar', text);

      const result = await store.get('other', 'bar');
      expect(result).toEqual(undefined);
    });
  });

  describe('clear', () => {
    it('clears all the items in a given namespace', async () => {
      const store = await create();

      await store.set('foo', 'bar', 'text');
      await store.set('foo', 'bash', 'otherText');

      await store.clear('foo');
      const result1 = await store.get('foo', 'bar');
      expect(result1).toEqual(undefined);
      const result2 = await store.get('foo', 'bash');
      expect(result2).toEqual(undefined);
    });
  });
};
