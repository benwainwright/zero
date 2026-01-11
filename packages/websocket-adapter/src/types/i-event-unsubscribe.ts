import type { IKnownEvents } from '@client';

export interface IEventUnsubscribe {
  type: 'subscibe';
  event: keyof IKnownEvents;
}
