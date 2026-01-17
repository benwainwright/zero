export type IExtractParams<TRequest> = TRequest extends {
  params: infer TParams;
}
  ? TParams
  : never;
