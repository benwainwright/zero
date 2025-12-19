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
import { Plugin, type PluginApi } from '@inversifyjs/plugin';
import { inject } from '@lib';
import { getPriority } from './get-priority.ts';

const INVERSIFY_METADATA_KEY = '@inversifyjs/core/classMetadataReflectKey';

type ContainerWithMove<TMap extends BindingMap> = TypedContainer<TMap> & {
  moveBinding(from: string, to: string): Promise<void>;
};

class MovePlugin<TMap extends BindingMap> extends Plugin<
  ContainerWithMove<TMap>
> {
  override load(api: PluginApi): void {
    api.define('moveBinding', async (from: string, to: string) => {
      await this.moveBinding(from, to);
    });
  }

  private async moveBinding(from: string, to: string) {
    const result = this._context.bindingService.get(from);

    if (result) {
      for (const thing of result) {
        if (thing.type === 'Instance') {
          this._context.bindingService.set({
            ...thing,
            serviceIdentifier: to,
          });
        }
      }
    }

    await this._container.unbind(from);
  }
}

@injectable()
export class DecoratorManager<TMap extends BindingMap> {
  private readonly container: ContainerWithMove<TMap>;

  public constructor(
    @inject('Container')
    container: TypedContainer<TMap>
  ) {
    this.container = container as ContainerWithMove<TMap>;
  }

  private pluginLoaded = false;

  public loadPluginIfNotLoaded() {
    if (!this.pluginLoaded) {
      this.container.register(MovePlugin);
      this.pluginLoaded = true;
    }
  }

  private decorationMap = new Map<
    keyof TMap,
    { thing: Newable<any>; args: ConstructorArgument[] }[]
  >();

  private getConstructorArguments(thing: Newable<any>) {
    const meta = Reflect.getMetadata(INVERSIFY_METADATA_KEY, thing);
    return meta.constructorArguments as ConstructorArgument[];
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
    theThing: Newable<any>,
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
    decorators: { thing: Newable<any> }[]
  ) {
    for (let index = 0; index < decorators.length; index++) {
      const decorator = decorators[index];
      if (!decorator) {
        break;
      }
      const { thing: atIndex } = decorator;
      if (index === 0) {
        const rootKey = this.getRootKey(token);
        if (!this.container.isBound(rootKey)) {
          await this.container.moveBinding(token as string, rootKey);
        }
        if (this.container.isBound(token)) {
          await this.container.unbind(token);
        }
        this.container.bind(token).to(atIndex);
      } else {
        const decoratorKey = this.getDecoratorKeyForIndex(token, index);
        if (this.container.isBound(decoratorKey)) {
          await this.container.unbind(decoratorKey);
        }
        this.container.bind(decoratorKey).to(atIndex);
      }
      this.adjustConstructorParamDecoration(token as string, atIndex, index);
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

  private storeDecoration(token: keyof TMap, thing: Newable<any>) {
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
}
