export interface IQuery<TKey> {
  id: string;
  key: TKey;
  params?: unknown;
  response: unknown;
}
