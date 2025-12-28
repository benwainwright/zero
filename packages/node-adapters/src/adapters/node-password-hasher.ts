import type { IPasswordHasher } from '@zero/auth';
import bcrypt from 'bcryptjs';
import { injectable } from 'inversify';

@injectable()
export class NodePasswordHasher implements IPasswordHasher {
  public async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
