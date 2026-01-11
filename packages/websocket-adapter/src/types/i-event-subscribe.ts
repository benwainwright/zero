import type { IKnownEvents } from '@client';

export interface IEventSubscribe {
  type: 'subscibe';
  event: keyof IKnownEvents;
}
