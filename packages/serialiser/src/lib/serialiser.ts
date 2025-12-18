import { type IUser, User } from '@zero/domain';
import { Typeson } from 'typeson';

export class Serialiser {
  private registry = new Typeson();

  public constructor() {
    this.registry.register({
      user: [
        (thing) => thing instanceof User,
        (user: User) => user.toObject(),
        (raw: IUser) => User.reconstitute(raw),
      ],
    });
  }

  public serialise(thing: unknown): string {
    const result = this.registry.stringify(thing);
    if (result instanceof Promise) {
      throw new Error(`Typeson returned promise`);
    }
    return result;
  }

  public deserialise(data: string): unknown {
    return this.registry.parse(data);
  }
}
