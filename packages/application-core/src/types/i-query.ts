export interface IRequest<TKey> {
  id: string;
  key: TKey;
  params?: unknown;
  response: unknown;
}
