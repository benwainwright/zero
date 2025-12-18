export interface IQuery<TKey> {
  query: {
    key: TKey;
    params: unknown;
  };
  response: unknown;
}
