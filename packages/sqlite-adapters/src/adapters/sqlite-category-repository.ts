import { Category } from '@zero/domain';
import { BaseRepo } from './base-repo.ts';
import type { IWriteRepository } from '@zero/application-core';
import type { ICategoryRepository } from '@zero/accounts';
import { inject } from '@core';
import type { IKyselyTransactionManager } from '@zero/kysely-shared';
import type { Categories, DB } from '../core/database.ts';
import type { Selectable } from 'kysely';

export class SqliteCategoryRepository
  extends BaseRepo<Category, [string]>
  implements IWriteRepository<Category>, ICategoryRepository
{
  public override async save(entity: Category): Promise<Category> {
    const tx = this.database.transaction();
    await tx.insertInto('categories').values(entity.toObject()).execute();
    return entity;
  }
  public constructor(
    @inject('KyselyTransactionManager')
    private readonly database: IKyselyTransactionManager<DB>
  ) {
    super();
  }

  private mapRaw(raw: Selectable<Categories>) {
    return Category.reconstitute({
      ...raw,
      description: raw.description ?? undefined,
    });
  }

  public override async get(key: string): Promise<Category | undefined> {
    const tx = this.database.transaction();

    const result = await tx
      .selectFrom('categories')
      .selectAll()
      .where('id', '=', key)
      .executeTakeFirst();

    if (!result) {
      return undefined;
    }

    return this.mapRaw(result);
  }

  public async list({
    userId,
    start,
    limit,
  }: {
    userId: string;
    start: number;
    limit: number;
  }): Promise<Category[]> {
    const tx = this.database.transaction();
    const result = await tx
      .selectFrom('categories')
      .selectAll()
      .offset(start)
      .limit(limit)
      .where('ownerId', '=', userId)
      .execute();

    return result.map((role) => this.mapRaw(role));
  }
  public async update(entity: Category): Promise<Category> {
    const tx = this.database.transaction();
    await tx
      .updateTable('categories')
      .set(entity.toObject())
      .where('id', '=', entity.id)
      .execute();

    return entity;
  }

  public async delete(category: Category): Promise<void> {
    const tx = this.database.transaction();

    await tx.deleteFrom('categories').where('id', '=', category.id).execute();
  }
}
