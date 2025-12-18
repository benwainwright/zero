export type ICommand<TKey extends string> = {
  key: TKey;
  params: unknown;
};
