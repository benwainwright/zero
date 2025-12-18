import type { AbstractQuery } from '@core';

export interface IQuery<TResponse> {
  query: AbstractQuery<string>;
  response: TResponse;
}
