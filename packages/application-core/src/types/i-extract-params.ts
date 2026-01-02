export type IExtractParams<TCommand> = TCommand extends {
  params: infer TParams;
}
  ? TParams
  : never;
