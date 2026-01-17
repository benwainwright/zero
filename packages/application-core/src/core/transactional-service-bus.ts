import type { IDomainEventStore, IServiceBus, IUnitOfWork } from '@ports';
import type { IRequest } from '@types';
import { priority, type ILogger } from '@zero/bootstrap';
import { inject } from './typed-inject.ts';

const LOG_CONTEXT = { context: 'transactional-query-bus' };

@priority(10_000)
export class TransactionalServiceBus implements IServiceBus {
  public constructor(
    @inject('ServiceBus')
    private rootBus: IServiceBus,

    @inject('UnitOfWork')
    private unitOfWork: IUnitOfWork,

    @inject('DomainEventEmitter')
    private domainEvents: IDomainEventStore,

    @inject('Logger')
    private logger: ILogger
  ) {}

  public async execute<TQuery extends IRequest<string>>(
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
      this.domainEvents.flush();
      return result;
    } catch (error) {
      this.logger.debug(
        `Execution failed - rolling back unit of work`,
        LOG_CONTEXT
      );
      await this.unitOfWork.rollback();
      this.domainEvents.purge();
      throw error;
    }
  }
}
