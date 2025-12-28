import { TypedContainer } from '@inversifyjs/strongly-typed';
import { injectable } from 'inversify';
import { MovePlugin } from './move-plugin.ts';

describe('MovePlugin', () => {
  it('moves instance bindings to the new key', async () => {
    interface ContainerTypes {
      Foo: Foo;
      FooMoved: Foo;
    }

    @injectable()
    class Foo {}

    const container = new TypedContainer<ContainerTypes>();
    container.bind('Foo').to(Foo);

    container.register(MovePlugin);

    await (
      container as TypedContainer<ContainerTypes> & {
        moveBinding: (from: string, to: string) => Promise<void>;
      }
    ).moveBinding('Foo', 'FooMoved');

    expect(container.isBound('Foo')).toBe(false);
    expect(container.isBound('FooMoved')).toBe(true);
    expect(container.get('FooMoved')).toBeInstanceOf(Foo);
  });

  it('removes non-instance bindings without recreating them', async () => {
    interface ContainerTypes {
      Value: number;
      ValueMoved: number;
    }

    const container = new TypedContainer<ContainerTypes>();
    container.bind('Value').toConstantValue(12);

    container.register(MovePlugin);

    await (
      container as TypedContainer<ContainerTypes> & {
        moveBinding: (from: string, to: string) => Promise<void>;
      }
    ).moveBinding('Value', 'ValueMoved');

    expect(container.isBound('Value')).toBe(false);
    expect(container.isBound('ValueMoved')).toBe(false);
  });
});
