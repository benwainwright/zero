import type { DomainEvents } from './domain-events.ts';

import type { IEvent } from './i-event.ts';

export abstract class DomainModel<TShape> {
  public abstract readonly id: string;

  private events: IEvent<DomainEvents, keyof DomainEvents>[] = [];

  public hasEvents(): boolean {
    return this.events.length > 0;
  }

  public pullEvents(): IEvent<DomainEvents, keyof DomainEvents>[] {
    const events = this.events;
    this.events = [];
    return events;
  }

  protected raiseEvent<TKey extends keyof DomainEvents>(
    event: IEvent<DomainEvents, TKey>
  ) {
    this.events.push(event);
  }

  public abstract toObject(config?: { secure: boolean }): TShape;
}
