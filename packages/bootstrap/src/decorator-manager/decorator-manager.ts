import { TypedContainer } from '@inversifyjs/strongly-typed';
import 'reflect-metadata';
import { inject as inversifyInject } from 'inversify';
import { type Newable, decorate } from 'inversify';
import type {
  BindingMap,
  ConstructorArgument,
  ContainerBinding,
} from './inversify-types.ts';
import { injectable } from 'inversify';
import { inject } from '@inversify';
import { getPriority } from './get-priority.ts';
import type { ContainerWithMove } from './container-with-move.ts';
import { MovePlugin } from './move-plugin.ts';

const INVERSIFY_METADATA_KEY = '@inversifyjs/core/classMetadataReflectKey';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isConstructorArgument = (
  value: unknown
): value is ConstructorArgument => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    'value' in value &&
    'optional' in value &&
    'tags' in value &&
    'kind' in value
  );
};

const hasMoveBinding = <TMap extends BindingMap>(
  container: TypedContainer<TMap>
): container is ContainerWithMove<TMap> => 'moveBinding' in container;

@injectable()
export class DecoratorManager<TMap extends BindingMap> {
  private readonly container: TypedContainer<TMap>;
  private static readonly containersWithMove = new WeakSet<object>();

  public constructor(
    @inject('Container')
    container: TypedContainer<TMap>
  ) {
    this.container = container;
  }

  private pluginLoaded = false;

  public loadPluginIfNotLoaded() {
    if (DecoratorManager.containersWithMove.has(this.container)) {
      this.pluginLoaded = true;
      return;
    }

    if (hasMoveBinding(this.container)) {
      DecoratorManager.containersWithMove.add(this.container);
      this.pluginLoaded = true;
      return;
    }

    if (!this.pluginLoaded) {
      this.container.register(MovePlugin);
      DecoratorManager.containersWithMove.add(this.container);
      this.pluginLoaded = true;
    }
  }

  private decorationMap = new Map<
    keyof TMap,
    { thing: Newable<unknown>; args: ConstructorArgument[] }[]
  >();

  private getConstructorArguments(thing: Newable<unknown>) {
    const meta = Reflect.getMetadata(INVERSIFY_METADATA_KEY, thing);
    if (!isRecord(meta)) {
      return [];
    }

    const constructorArguments = meta['constructorArguments'];

    if (!Array.isArray(constructorArguments)) {
      return [];
    }

    return constructorArguments.filter(isConstructorArgument);
  }

  private getDecoratorKeyForIndex(token: keyof TMap, index: number) {
    return `${String(token)}-decorator-${index}`;
  }

  private getRootKey(token: keyof TMap) {
    return `${String(token)}-decorator-chain-root`;
  }

  public decoratorCountForToken(token: string) {
    return this.decorationMap.get(token)?.length ?? 0;
  }

  private getInjectDecoratorForIndex(
    token: string,
    constructorArgument: ConstructorArgument,
    serviceIndex: number
  ) {
    if (constructorArgument.value === token) {
      if (serviceIndex === this.decoratorCountForToken(token) - 1) {
        return inversifyInject(this.getRootKey(token));
      } else {
        return inversifyInject(
          this.getDecoratorKeyForIndex(token, serviceIndex + 1)
        );
      }
    } else {
      return inversifyInject(constructorArgument.value);
    }
  }

  private adjustConstructorParamDecoration(
    token: string,
    theThing: Newable<unknown>,
    serviceIndex: number
  ) {
    const args = this.getConstructorArguments(theThing);
    Reflect.deleteMetadata(INVERSIFY_METADATA_KEY, theThing);
    args.forEach((item, index) => {
      decorate(
        this.getInjectDecoratorForIndex(token, item, serviceIndex),
        theThing,
        index
      );
    });
  }

  private async bindDecoratorList<TKey extends keyof TMap>(
    token: TKey & string,
    decorators: { thing: Newable<unknown> }[]
  ) {
    const containerWithMove = this.getContainerWithMove();
    for (let index = 0; index < decorators.length; index++) {
      const decorator = decorators[index];
      if (!decorator) {
        break;
      }
      const { thing: atIndex } = decorator;
      if (index === 0) {
        const rootKey = this.getRootKey(token);
        if (!containerWithMove.isBound(rootKey)) {
          await containerWithMove.moveBinding(token, rootKey);
        }
        if (containerWithMove.isBound(token)) {
          await containerWithMove.unbind(token);
        }
        containerWithMove.bind(token).to(atIndex);
      } else {
        const decoratorKey = this.getDecoratorKeyForIndex(token, index);
        if (containerWithMove.isBound(decoratorKey)) {
          await containerWithMove.unbind(decoratorKey);
        }
        containerWithMove.bind(decoratorKey).to(atIndex);
      }
      this.adjustConstructorParamDecoration(token, atIndex, index);
    }
  }

  public async decorate<TKey extends keyof TMap & string>(
    token: TKey,
    thing: Newable<ContainerBinding<TMap, TKey>>
  ) {
    this.loadPluginIfNotLoaded();
    this.storeDecoration(token, thing);
    this.resetConstructorArgs(token);

    const currentDecorations = this.decorationMap.get(token);

    if (currentDecorations) {
      const completeList = currentDecorations.toReversed().toSorted((a, b) => {
        const aPriority = getPriority(a.thing) ?? 0;
        const bPriority = getPriority(b.thing) ?? 0;

        return aPriority > bPriority ? -1 : 1;
      });
      await this.bindDecoratorList(token, completeList);
    }
  }

  private resetConstructorArgs(token: keyof TMap) {
    const existingDecorations = this.decorationMap.get(token);
    if (!existingDecorations) {
      return;
    }
    for (let { thing, args } of existingDecorations) {
      Reflect.deleteMetadata(INVERSIFY_METADATA_KEY, thing);
      args.forEach((arg, index) => {
        decorate(inversifyInject(arg.value), thing, index);
      });
    }
  }

  private storeDecoration(token: keyof TMap, thing: Newable<unknown>) {
    const existingDecorations = this.decorationMap.get(token);
    if (!existingDecorations) {
      this.decorationMap.set(token, [
        { thing: thing, args: this.getConstructorArguments(thing) },
      ]);
    } else {
      this.decorationMap.set(token, [
        ...existingDecorations,
        { thing: thing, args: this.getConstructorArguments(thing) },
      ]);
    }
  }

  private getContainerWithMove(): ContainerWithMove<TMap> {
    this.loadPluginIfNotLoaded();

    if (!hasMoveBinding(this.container)) {
      throw new Error('MovePlugin did not register moveBinding');
    }

    return this.container;
  }
}
