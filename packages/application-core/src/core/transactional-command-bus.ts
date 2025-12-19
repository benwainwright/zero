import type { ICommandBus, IDomainEventStore, IUnitOfWork } from '@ports';
import { injectable } from 'inversify';
import { inject } from './typed-inject.ts';
import { priority, type ILogger } from '@zero/bootstrap';
import type { ICommand } from '@types';

const LOG_CONTEXT = { context: 'transactional-service-bus' };

@priority(10_000)
@injectable()
export class TransactionalCommandBus implements ICommandBus {
  public constructor(
    @inject('CommandBus')
    private rootBus: ICommandBus,

    @inject('UnitOfWork')
    private unitOfWork: IUnitOfWork,

    @inject('DomainEventEmitter')
    private domainEvents: IDomainEventStore,

    @inject('Logger')
    private logger: ILogger
  ) {}

  public async execute(command: ICommand<string>) {
    try {
      this.logger.silly(
        `Transactional service bus beginning execution`,
        LOG_CONTEXT
      );

      await this.unitOfWork.begin();

      const result = await this.rootBus.execute(command);

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
