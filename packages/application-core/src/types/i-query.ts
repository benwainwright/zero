export interface IQuery<TKey> {
  query: {
    id: string;
    key: TKey;
    params: unknown;
  };
  response: unknown;
}
