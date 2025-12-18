import type { DomainModel } from '@zero/domain';

export interface IDomainEventBuffer {
  stageEvents: (entity: DomainModel<unknown>) => void;
}
