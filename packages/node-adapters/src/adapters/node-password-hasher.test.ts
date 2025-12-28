import { when } from 'vitest-when';
import { NodePasswordHasher } from './node-password-hasher.ts';
import bcrypt from 'bcryptjs';

vi.mock('bcryptjs');

afterEach(() => {
  vi.resetAllMocks();
});

describe('node password hasher', () => {
  it('passes the hash into bcrypt', async () => {
    when<(num: number) => Promise<string>>(bcrypt.genSalt)
      .calledWith(10)
      .thenResolve('foo');

    when<(password: string, salt: string) => Promise<string>>(bcrypt.hash)
      .calledWith('password', 'foo')
      .thenResolve('salted-hash');

    const thePassword = 'password';

    const nodePasswordHasher = new NodePasswordHasher();

    const result = await nodePasswordHasher.hashPassword(thePassword);
    expect(result).toEqual('salted-hash');
  });
});
