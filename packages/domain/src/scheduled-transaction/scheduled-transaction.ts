import { DomainModel } from '@core';
import type { IScheduledTransaction } from './i-scheduled-transaction.ts';

export class ScheduledTransaction extends DomainModel<IScheduledTransaction> {
  public override readonly id: string;

  public readonly when: string;

  public override toObject(): {
    id: string;
    when: string;
  } {
    return {
      id: this.id,
      when: this.when,
    };
  }

  public constructor(config: IScheduledTransaction) {
    super();
    this.id = config.id;
    this.when = config.when;
  }
}
