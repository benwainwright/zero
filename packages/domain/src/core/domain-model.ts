import type { IDomainEvents } from './domain-events.ts';

import type { IEvent } from './i-event.ts';

export abstract class DomainModel<TShape> {
  public abstract id: string;

  private events: IEvent<IDomainEvents, keyof IDomainEvents>[] = [];

  public hasEvents(): boolean {
    return this.events.length > 0;
  }

  public pullEvents(): IEvent<IDomainEvents, keyof IDomainEvents>[] {
    const events = this.events;
    this.events = [];
    return events;
  }

  protected raiseEvent<TKey extends keyof IDomainEvents>(
    event: IEvent<IDomainEvents, TKey>
  ) {
    this.events.push(event);
  }

  public abstract toObject(config?: { secure: boolean }): TShape;
}
