import type { Newable } from 'inversify';
import type { BindingMap, ConstructorArgument } from './inversify-types.ts';
import type { ContainerWithMove } from './container-with-move.ts';

export interface IParentDecoratorManager<TMap extends BindingMap> {
  decorationMap: Map<
    keyof TMap,
    {
      thing: Newable<unknown>;
      args: ConstructorArgument[];
      isFromParent: boolean;
    }[]
  >;

  getContainerWithMove(parent: boolean): ContainerWithMove<TMap>;
}
