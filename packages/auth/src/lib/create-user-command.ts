export class CreateUserCommand {
  public constructor(
    public readonly username: string,
    public readonly email: string,
    public readonly password: string
  ) {}
}
