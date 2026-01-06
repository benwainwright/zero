import {
  Account,
  BankConnection,
  Budget,
  Category,
  OauthToken,
  Role,
  User,
} from '@zero/domain';
import { Serialiser } from './serialiser.ts';

describe('serialiser', () => {
  it('can serialise and deserialise users', () => {
    const serialiser = new Serialiser();
    const result = serialiser.serialise({
      user: User.reconstitute({
        id: 'foo',
        email: 'a@b.c',
        passwordHash: 'thing',
        roles: [],
      }),
    });

    expect(typeof result).toEqual('string');

    const deserialised = serialiser.deserialise(result);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((deserialised as any).user).toBeInstanceOf(User);
  });

  it('can serialise and deserialise roles', () => {
    const serialiser = new Serialiser();
    const result = serialiser.serialise({
      role: Role.reconstitute({
        id: 'admin',
        name: 'Administrator',
        routes: ['all'],
        permissions: [
          {
            resource: '*',
            action: 'ALLOW',
            capabilities: ['all'],
          },
        ],
      }),
    });

    expect(typeof result).toEqual('string');

    const deserialised = serialiser.deserialise(result);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((deserialised as any).role).toBeInstanceOf(Role);
  });

  it('can serialise and deserialise category', () => {
    const serialiser = new Serialiser();
    const result = serialiser.serialise({
      category: Category.reconstitute({
        id: 'admin',
        ownerId: 'ben',
        name: 'Administrator',
        description: 'foo',
      }),
    });

    expect(typeof result).toEqual('string');

    const deserialised = serialiser.deserialise(result);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((deserialised as any).category).toBeInstanceOf(Category);
  });

  it('can serialise and deserialise bank connections', () => {
    const serialiser = new Serialiser();
    const result = serialiser.serialise({
      connection: BankConnection.reconstitute({
        id: 'foo',
        ownerId: 'ben',
        bankName: 'foo',
        logo: 'bar',
      }),
    });

    expect(typeof result).toEqual('string');

    const deserialised = serialiser.deserialise(result);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((deserialised as any).connection).toBeInstanceOf(BankConnection);
  });

  it('can serialise and deserialise accounts', () => {
    const serialiser = new Serialiser();
    const result = serialiser.serialise({
      account: Account.reconstitute({
        ownerId: 'foo',
        id: 'id',
        name: 'account name',
        type: 'accont_type',
        closed: false,
        balance: 10_000,
        deleted: false,
      }),
    });

    expect(typeof result).toEqual('string');

    const deserialised = serialiser.deserialise(result);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((deserialised as any).account).toBeInstanceOf(Account);
  });

  it('can serialise and deserialise budgets', () => {
    const serialiser = new Serialiser();
    const result = serialiser.serialise({
      budget: Budget.reconstitute({
        ownerId: 'ben',
        id: 'foo',
        description: '',
        month: 12,
        year: 2024,
        transactions: [],
        initialBalances: {
          foo: {
            assigned: 43,
          },
          bar: {
            assigned: 150,
          },
        },
      }),
    });

    expect(typeof result).toEqual('string');

    const deserialised = serialiser.deserialise(result);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((deserialised as any).budget).toBeInstanceOf(Budget);
  });

  it('can serialise and deserialise tokens', () => {
    const serialiser = new Serialiser();
    const result = serialiser.serialise({
      token: OauthToken.reconstitute({
        id: 'foo',
        provider: 'ynab',
        token: 'token',
        refreshExpiry: undefined,
        refreshToken: 'string',
        expiry: new Date(),
        lastUse: undefined,
        created: new Date(),
        refreshed: undefined,
        ownerId: 'user',
      }),
    });

    expect(typeof result).toEqual('string');

    const deserialised = serialiser.deserialise(result);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((deserialised as any).token).toBeInstanceOf(OauthToken);
  });

  it('can serialise and deserialise categories', () => {
    const serialiser = new Serialiser();
    const result = serialiser.serialise({
      category: Category.reconstitute({
        id: 'foo',
        name: 'foo',
        description: 'bar',
        ownerId: 'ben',
      }),
    });

    expect(typeof result).toEqual('string');

    const deserialised = serialiser.deserialise(result);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((deserialised as any).category).toBeInstanceOf(Category);
  });
});
