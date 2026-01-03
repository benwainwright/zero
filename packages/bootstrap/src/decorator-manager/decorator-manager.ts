import { TypedContainer } from '@inversifyjs/strongly-typed';
import 'reflect-metadata';
import { inject as inversifyInject, unmanaged } from 'inversify';
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
import type { IParentDecoratorManager } from './i-parent-decorator-manager.ts';
import type { IDecoratorManager } from './i-decorator-manager.ts';

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
export class DecoratorManager<TMap extends BindingMap>
  implements IDecoratorManager<TMap>
{
  private readonly container: TypedContainer<TMap>;
  private static readonly containersWithMove = new WeakSet<object>();

  public constructor(
    @inject('Container')
    container: TypedContainer<TMap>,

    @unmanaged()
    private readonly parent?: IParentDecoratorManager<TMap>
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

  public get decorationMap() {
    if (!this.parent) {
      return this.decorationMap_;
    }

    const finalMap = new Map<
      keyof TMap,
      {
        thing: Newable<unknown>;
        args: ConstructorArgument[];
        isFromParent: boolean;
      }[]
    >();

    for (const [key, value] of this.parent.decorationMap) {
      const existingDecs = this.decorationMap_.get(key);
      if (existingDecs) {
        const values = [
          ...value,
          ...existingDecs.map((dec) => ({ ...dec, isFromParent: true })),
        ];
        finalMap.set(key, values);
      }
    }

    for (const [key, value] of this.decorationMap_) {
      if (!finalMap.has(key)) {
        finalMap.set(key, value);
      }
    }

    return finalMap;
  }

  private decorationMap_ = new Map<
    keyof TMap,
    {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      thing: Newable<any>;
      args: ConstructorArgument[];
      isFromParent: boolean;
    }[]
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

  private getDecoratorKeyForIndex(
    token: keyof TMap,
    index: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decorators: { thing: Newable<any>; isFromParent: boolean }[]
  ) {
    const decorator = decorators[index];
    return `${String(token)}-decorator-${decorator?.thing.name ?? ''}`;
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
    serviceIndex: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decorators: { thing: Newable<any>; isFromParent: boolean }[]
  ) {
    if (constructorArgument.value === token) {
      if (serviceIndex === this.decoratorCountForToken(token) - 1) {
        return inversifyInject(this.getRootKey(token));
      } else {
        return inversifyInject(
          this.getDecoratorKeyForIndex(token, serviceIndex + 1, decorators)
        );
      }
    } else {
      return inversifyInject(constructorArgument.value);
    }
  }

  private adjustConstructorParamDecoration(
    token: string,
    theThing: Newable<unknown>,
    serviceIndex: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decorators: { thing: Newable<any>; isFromParent: boolean }[]
  ) {
    const args = this.getConstructorArguments(theThing);
    Reflect.deleteMetadata(INVERSIFY_METADATA_KEY, theThing);
    args.forEach((item, index) => {
      decorate(
        this.getInjectDecoratorForIndex(token, item, serviceIndex, decorators),
        theThing,
        index
      );
    });
  }

  private bindDecoratorList(
    token: keyof TMap & string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    decorators: { thing: Newable<any>; isFromParent: boolean }[]
  ) {
    for (let index = 0; index < decorators.length; index++) {
      const decorator = decorators[index];
      if (!decorator) {
        break;
      }
      const { thing: atIndex } = decorator;
      const containerWithMove = this.getContainerWithMove(
        decorator.isFromParent
      );
      if (index === 0) {
        const rootKey = this.getRootKey(token);
        if (!containerWithMove.isBound(rootKey)) {
          containerWithMove.moveBinding(token, rootKey);
        }

        if (containerWithMove.isBound(token)) {
          containerWithMove.unbindSync(token);
        }
        containerWithMove.bind(token).to(atIndex);
      } else {
        const decoratorKey = this.getDecoratorKeyForIndex(
          token,
          index,
          decorators
        );
        if (containerWithMove.isBound(decoratorKey)) {
          containerWithMove.unbindSync(decoratorKey);
        }
        containerWithMove.bind(decoratorKey).to(atIndex);
      }
      this.adjustConstructorParamDecoration(token, atIndex, index, decorators);
    }
  }

  public decorate<TKey extends keyof TMap & string>(
    token: TKey,
    thing: Newable<ContainerBinding<TMap, TKey>>
  ) {
    this.loadPluginIfNotLoaded();
    this.storeDecoration(token, thing);
    this.resetConstructorArgs(token);
    this.save(token);
  }

  public save<TKey extends keyof TMap & string>(token: TKey) {
    const currentDecorations = this.decorationMap.get(token);
    if (currentDecorations) {
      const completeList = currentDecorations.toReversed().toSorted((a, b) => {
        const aPriority = getPriority(a.thing) ?? 0;
        const bPriority = getPriority(b.thing) ?? 0;

        return aPriority > bPriority ? -1 : 1;
      });
      this.bindDecoratorList(token as string, completeList);
    }
  }

  private resetConstructorArgs(token: keyof TMap) {
    const existingDecorations = this.decorationMap.get(token);
    if (!existingDecorations) {
      return;
    }
    for (const { thing, args } of existingDecorations) {
      Reflect.deleteMetadata(INVERSIFY_METADATA_KEY, thing);
      args.forEach((arg, index) => {
        decorate(inversifyInject(arg.value), thing, index);
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private storeDecoration(token: keyof TMap, thing: Newable<any>) {
    const existingDecorations = this.decorationMap_.get(token);
    if (!existingDecorations) {
      this.decorationMap_.set(token, [
        {
          thing: thing,
          args: this.getConstructorArguments(thing),
          isFromParent: false,
        },
      ]);
    } else {
      this.decorationMap_.set(token, [
        ...existingDecorations,
        {
          thing: thing,
          args: this.getConstructorArguments(thing),
          isFromParent: false,
        },
      ]);
    }
  }

  public getContainerWithMove(parent?: boolean): ContainerWithMove<TMap> {
    if (parent && this.parent) {
      return this.parent.getContainerWithMove(false);
    }

    this.loadPluginIfNotLoaded();

    if (!hasMoveBinding(this.container)) {
      throw new Error('MovePlugin did not register moveBinding');
    }

    return this.container;
  }
}
