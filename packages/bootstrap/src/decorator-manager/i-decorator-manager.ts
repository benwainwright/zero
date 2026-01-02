import { type BindingMap, type ContainerBinding } from './inversify-types.ts';
import { type Newable } from 'inversify';

export interface IDecoratorManager<TMap extends BindingMap = any> {
  decorate<TKey extends keyof TMap & string>(
    token: TKey,
    thing: Newable<ContainerBinding<TMap, TKey>>
  ): void;

  save(): void;
}
