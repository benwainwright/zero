export abstract class BaseHandler<TKey extends string> {
  public abstract readonly name: TKey;
}
