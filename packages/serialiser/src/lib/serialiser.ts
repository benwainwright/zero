import {
  Account,
  BankConnection,
  Budget,
  Category,
  OauthToken,
  Role,
  Transaction,
  User,
} from '@zero/domain';
import { Typeson } from 'typeson';
import { injectable } from 'inversify';
import { modelSerialiser } from './model-serialiser.ts';

@injectable()
export class Serialiser {
  private registry = new Typeson();

  public constructor() {
    this.registry.register({
      ...modelSerialiser(Role),
      ...modelSerialiser(User),
      ...modelSerialiser(BankConnection),
      ...modelSerialiser(Account),
      ...modelSerialiser(Budget),
      ...modelSerialiser(OauthToken),
      ...modelSerialiser(Category),
      ...modelSerialiser(Transaction),
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
