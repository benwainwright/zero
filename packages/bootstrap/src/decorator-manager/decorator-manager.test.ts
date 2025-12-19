import { DecoratorManager } from './decorator-manager.ts';
import { TypedContainer } from '@inversifyjs/strongly-typed';
import { injectable, inject } from 'inversify';
import { priority } from './priority.ts';

describe('decorate', () => {
  it('reorders execution based on priority tags', async () => {
    const order: string[] = [];

    interface IThing {
      doThing(): void;
    }

    @injectable()
    class Decorated implements IThing {
      public constructor(
        @inject('TheOtherThing')
        private otherThing: Foo
      ) {}

      doThing() {
        order.push('root');
      }
    }

    @injectable()
    class Foo {
      public constructor(
        @inject('More')
        private readonly: string
      ) {}
    }

    @injectable()
    class Decorator implements IThing {
      public constructor(
        @inject('TheThing')
        private root: IThing
      ) {}
      doThing() {
        order.push('decorator');
        this.root.doThing();
      }
    }

    @priority(1000)
    @injectable()
    class AnotherDecorator implements IThing {
      public constructor(
        @inject('TheThing')
        private root: IThing
      ) {}
      doThing() {
        order.push('second-decorator');
        this.root.doThing();
      }
    }

    @priority(500)
    @injectable()
    class AFourthDecorator implements IThing {
      public constructor(
        @inject('Fish')
        private fish: number,

        @inject('TheThing')
        private root: IThing
      ) {}
      doThing() {
        order.push('third-decorator');
        this.root.doThing();
      }
    }

    @injectable()
    class EvenMoreDecorators implements IThing {
      public constructor(
        @inject('Fish')
        private fish: number,

        @inject('TheThing')
        private root: IThing
      ) {}
      doThing() {
        order.push('fourth-decorator');
        this.root.doThing();
      }
    }

    interface ContainerTypes {
      TheThing: IThing;
      TheOtherThing: Foo;
      Fish: number;
      More: string;
    }

    const container = new TypedContainer<ContainerTypes>();
    const manager = new DecoratorManager(container);
    container.bind('TheThing').to(Decorated);
    container.bind('Fish').toConstantValue(2);
    container.bind('TheOtherThing').to(Foo);
    container.bind('More').toConstantValue('foo');

    await manager.decorate('TheThing', Decorator);
    await manager.decorate('TheThing', AnotherDecorator);
    await manager.decorate('TheThing', AFourthDecorator);
    await manager.decorate('TheThing', EvenMoreDecorators);

    const result = container.get('TheThing');
    result.doThing();
    expect(order).toEqual([
      'second-decorator',
      'third-decorator',
      'fourth-decorator',
      'decorator',
      'root',
    ]);
  });
  it('order of execution matches the order decorate is called if there are no priority tags', async () => {
    const order: string[] = [];

    interface IThing {
      doThing(): void;
    }

    @injectable()
    class Decorated implements IThing {
      public constructor(
        @inject('TheOtherThing')
        private otherThing: Foo
      ) {}

      doThing() {
        order.push('root');
      }
    }

    @injectable()
    class Foo {
      public constructor(
        @inject('More')
        private readonly: string
      ) {}
    }

    @injectable()
    class Decorator implements IThing {
      public constructor(
        @inject('TheThing')
        private root: IThing
      ) {}
      doThing() {
        order.push('decorator');
        this.root.doThing();
      }
    }

    @injectable()
    class AnotherDecorator implements IThing {
      public constructor(
        @inject('TheThing')
        private root: IThing
      ) {}
      doThing() {
        order.push('second-decorator');
        this.root.doThing();
      }
    }

    @injectable()
    class AFourthDecorator implements IThing {
      public constructor(
        @inject('Fish')
        private fish: number,

        @inject('TheThing')
        private root: IThing
      ) {}
      doThing() {
        order.push('third-decorator');
        this.root.doThing();
      }
    }

    @injectable()
    class EvenMoreDecorators implements IThing {
      public constructor(
        @inject('Fish')
        private fish: number,

        @inject('TheThing')
        private root: IThing
      ) {}
      doThing() {
        order.push('fourth-decorator');
        this.root.doThing();
      }
    }

    interface ContainerTypes {
      TheThing: IThing;
      TheOtherThing: Foo;
      Fish: number;
      More: string;
    }

    const container = new TypedContainer<ContainerTypes>();
    const manager = new DecoratorManager(container);
    container.bind('TheThing').to(Decorated);
    container.bind('Fish').toConstantValue(2);
    container.bind('TheOtherThing').to(Foo);
    container.bind('More').toConstantValue('foo');

    await manager.decorate('TheThing', Decorator);
    await manager.decorate('TheThing', AnotherDecorator);
    await manager.decorate('TheThing', AFourthDecorator);
    await manager.decorate('TheThing', EvenMoreDecorators);

    const result = container.get('TheThing');
    result.doThing();
    expect(order).toEqual([
      'fourth-decorator',
      'third-decorator',
      'second-decorator',
      'decorator',
      'root',
    ]);
  });

  it('handles a long decoration chain', async () => {
    let calledOne = false;
    let calledTwo = false;
    let calledRoot = false;
    let calledThree = false;
    let calledFour = false;
    interface IThing {
      doThing(): void;
    }

    @injectable()
    class Decorated implements IThing {
      public constructor(
        @inject('TheOtherThing')
        private otherThing: Foo
      ) {}

      doThing() {
        calledRoot = true;
      }
    }

    @injectable()
    class Foo {
      public constructor(
        @inject('More')
        private readonly: string
      ) {}
    }

    @injectable()
    class Decorator implements IThing {
      public constructor(
        @inject('TheThing')
        private root: IThing
      ) {}
      doThing() {
        this.root.doThing();
        calledOne = true;
      }
    }

    @injectable()
    class AnotherDecorator implements IThing {
      public constructor(
        @inject('TheThing')
        private root: IThing
      ) {}
      doThing() {
        this.root.doThing();
        calledTwo = true;
      }
    }

    @injectable()
    class AFourthDecorator implements IThing {
      public constructor(
        @inject('Fish')
        private fish: number,

        @inject('TheThing')
        private root: IThing
      ) {}
      doThing() {
        this.root.doThing();
        calledFour = true;
      }
    }

    @injectable()
    class EvenMoreDecorators implements IThing {
      public constructor(
        @inject('Fish')
        private fish: number,

        @inject('TheThing')
        private root: IThing
      ) {}
      doThing() {
        this.root.doThing();
        calledThree = true;
      }
    }

    interface ContainerTypes {
      TheThing: IThing;
      TheOtherThing: Foo;
      Fish: number;
      More: string;
    }

    const container = new TypedContainer<ContainerTypes>();
    const manager = new DecoratorManager(container);
    container.bind('TheThing').to(Decorated);
    container.bind('Fish').toConstantValue(2);
    container.bind('TheOtherThing').to(Foo);
    container.bind('More').toConstantValue('foo');

    await manager.decorate('TheThing', Decorator);
    await manager.decorate('TheThing', AnotherDecorator);
    await manager.decorate('TheThing', EvenMoreDecorators);
    await manager.decorate('TheThing', AFourthDecorator);

    const result = container.get('TheThing');
    result.doThing();
    expect(calledOne).toEqual(true);
    expect(calledTwo).toEqual(true);
    expect(calledThree).toEqual(true);
    expect(calledFour).toEqual(true);
    expect(calledRoot).toEqual(true);
  });
  it('passes the decorated into the decorator on resolution', async () => {
    let called = false;
    interface IThing {
      doThing(): void;
    }

    @injectable()
    class Decorated implements IThing {
      public constructor(
        @inject('TheOtherThing')
        private otherThing: Foo
      ) {}

      doThing() {}
    }

    @injectable()
    class Foo {
      public constructor(
        @inject('More')
        private readonly: string
      ) {}
    }

    @injectable()
    class Decorator implements IThing {
      public constructor(
        @inject('TheThing')
        private root: IThing
      ) {}
      doThing() {
        this.root.doThing();
        called = true;
      }
    }

    interface ContainerTypes {
      TheThing: IThing;
      TheOtherThing: Foo;
      More: string;
    }

    const container = new TypedContainer<ContainerTypes>();
    const manager = new DecoratorManager(container);
    container.bind('TheThing').to(Decorated);
    container.bind('TheOtherThing').to(Foo);
    container.bind('More').toConstantValue('foo');

    await manager.decorate('TheThing', Decorator);

    const result = container.get('TheThing');
    result.doThing();
    expect(called).toEqual(true);
  });
});
