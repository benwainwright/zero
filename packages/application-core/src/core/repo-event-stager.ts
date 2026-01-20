import { inject } from 'inversify';

import type { IDomainEventBuffer, IWriteRepository } from '@ports';
import type { BindingMap } from '@zero/bootstrap';
import { injectable } from 'inversify';
import type { DomainModel } from '@zero/domain';

type WriteOnly<T extends BindingMap> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T as T[K] extends IWriteRepository<any> ? K : never]: T[K];
};

export const eventStager =
  <TTypes extends BindingMap>() =>
  <TKey extends keyof WriteOnly<TTypes>>(
    key: TKey
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): new (...any: any[]) => TTypes[TKey] => {
    @injectable()
    class RepoEventStager<TEntity extends DomainModel<unknown>>
      implements IWriteRepository<TEntity>
    {
      public constructor(
        @inject(key as string)
        public readonly root: IWriteRepository<TEntity>,

        @inject('DomainEventBuffer')
        public readonly eventBuffer: IDomainEventBuffer
      ) {}

      public async updateAll(entities: TEntity[]): Promise<TEntity[]> {
        entities.forEach((entity) => this.eventBuffer.stageEvents(entity));
        return await this.root.updateAll(entities);
      }

      public async update(entity: TEntity): Promise<TEntity> {
        this.eventBuffer.stageEvents(entity);
        return await this.root.update(entity);
      }

      public async save(entity: TEntity): Promise<TEntity> {
        this.eventBuffer.stageEvents(entity);
        return await this.root.save(entity);
      }

      public async saveAll(entities: TEntity[]): Promise<TEntity[]> {
        entities.forEach((item) => this.eventBuffer.stageEvents(item));
        return await this.root.saveAll(entities);
      }

      public async delete(entity: TEntity): Promise<void> {
        this.eventBuffer.stageEvents(entity);
        return await this.root.delete(entity);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return RepoEventStager as new (...args: any[]) => TTypes[TKey];
  };
