import { Role, User } from '@zero/domain';
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
});
