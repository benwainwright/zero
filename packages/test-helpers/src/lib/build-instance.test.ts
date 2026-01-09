import { Container, inject, injectable } from 'inversify';
import { when } from 'vitest-when';
import { buildInstance } from './build-instance.ts';

describe('build instance', () => {
  it('returns an instance of the thing as its first instance', async () => {
    interface IThing {
      foo: string;
    }

    interface IOtherThing {
      biz: string;
    }

    @injectable()
    class Foo {
      public constructor(
        @inject('Thing')
        public readonly thing: IThing,

        @inject('Bar')
        public readonly baz: IOtherThing
      ) {
        // NOOP
      }
    }

    const container = new Container();

    const [foo] = await buildInstance(Foo, container);

    expect(foo).toBeInstanceOf(Foo);
    expect(
      (foo.thing as unknown as { _isMockObject: boolean })._isMockObject
    ).toEqual(true);
  });

  it('allows me to set expectations on constructor args', async () => {
    interface IThing {
      foo: string;
    }

    interface IOtherThing {
      theCall(): string;
    }

    @injectable()
    class Foo {
      public constructor(
        @inject('Thing')
        public readonly thing: IThing,

        @inject('Bar')
        public readonly baz: IOtherThing
      ) {
        // NOOP
      }

      public execute() {
        return this.baz.theCall();
      }
    }

    const container = new Container();

    const [theInstance, , bar] = await buildInstance(Foo, container);

    when(bar.theCall).calledWith().thenReturn('hello');

    const result = theInstance.execute();
    expect(result).toEqual('hello');
  });
});
