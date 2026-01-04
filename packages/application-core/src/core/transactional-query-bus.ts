import type { IQueryBus, IUnitOfWork } from '@ports';
import type { IQuery } from '@types';
import { priority, type ILogger } from '@zero/bootstrap';
import { inject } from './typed-inject.ts';

const LOG_CONTEXT = { context: 'transactional-query-bus' };

@priority(10_000)
export class TransactionalQueryBus implements IQueryBus {
  public constructor(
    @inject('QueryBus')
    private rootBus: IQueryBus,

    @inject('UnitOfWork')
    private unitOfWork: IUnitOfWork,

    @inject('Logger')
    private logger: ILogger
  ) {
    console.log('Constructed tx query bus');
  }

  public async execute<TQuery extends IQuery<string>>(
    query: Omit<TQuery, 'response'>
  ): Promise<TQuery['response']> {
    try {
      this.logger.silly(
        `Transactional query bus beginning execution`,
        LOG_CONTEXT
      );

      await this.unitOfWork.begin();

      const result = await this.rootBus.execute(query);

      this.logger.silly(
        `Execution successful - committing unit of work`,
        LOG_CONTEXT
      );
      await this.unitOfWork.commit();
      return result;
    } catch (error) {
      this.logger.debug(
        `Execution failed - rolling back unit of work`,
        LOG_CONTEXT
      );
      await this.unitOfWork.rollback();
      throw error;
    }
  }
}
