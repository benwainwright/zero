import { type BindingMap, type ContainerBinding } from './inversify-types.ts';
import { type Newable } from 'inversify';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface IDecoratorManager<TMap extends BindingMap = any> {
  decorate<TKey extends keyof TMap & string>(
    token: TKey,
    thing: Newable<ContainerBinding<TMap, TKey>>
  ): void;
}
