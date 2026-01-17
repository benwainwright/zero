import type { IRequest } from './i-query.ts';

export type IPickRequest<
  TRequests extends IRequest<string>,
  TKey extends TRequests['key'] = string
> = Extract<TRequests, { key: TKey }>;
