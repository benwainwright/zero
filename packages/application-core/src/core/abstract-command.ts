export abstract class AbstractCommand<TName extends string> {
  public abstract readonly name: TName;
}
