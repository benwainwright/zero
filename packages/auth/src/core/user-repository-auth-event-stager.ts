import type { IUserRepository } from '@ports';
import type { IDomainEventBuffer } from '@zero/application-core';
import type { User } from '@zero/domain';
import { inject } from './typed-inject.ts';
import { injectable } from 'inversify';

@injectable()
export class UserRepositoryAuthEventStager implements IUserRepository {
  public constructor(
    @inject('UserRepository')
    private readonly users: IUserRepository,

    @inject('DomainEventBuffer')
    private readonly eventBuffer: IDomainEventBuffer
  ) {}

  public async saveUser(user: User): Promise<User> {
    this.eventBuffer.stageEvents(user);
    return await this.users.saveUser(user);
  }

  public async requireUser(id: string): Promise<User> {
    return await this.users.requireUser(id);
  }

  public async getUser(id: string): Promise<User | undefined> {
    return await this.users.getUser(id);
  }

  public async getManyUsers(start?: number, limit?: number): Promise<User[]> {
    return await this.users.getManyUsers(start, limit);
  }

  public async deleteUser(user: User): Promise<void> {
    this.eventBuffer.stageEvents(user);
    return await this.users.deleteUser(user);
  }
}
