export type ICommand<TKey extends string> = {
  key: TKey;
  id: string;
  params?: unknown;
};
