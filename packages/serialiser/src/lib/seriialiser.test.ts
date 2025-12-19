import { User } from '@zero/domain';
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

    expect((deserialised as any).user).toBeInstanceOf(User);
  });
});
