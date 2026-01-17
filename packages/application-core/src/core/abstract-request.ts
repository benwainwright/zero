export abstract class AbstractRequest<TName extends string> {
  public abstract name: TName;
}
