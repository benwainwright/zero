import type { IKnownEvents } from '@client';

export interface IEventUnsubscribe {
  type: 'subscribe';
  event: keyof IKnownEvents;
}
