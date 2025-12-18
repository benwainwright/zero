import type { ICommandBus, IQueryBus } from '@ports';
import { inject } from './typed-inject.ts';
import type { ICommand, IQuery } from '@types';
import { injectable } from 'inversify';

@injectable()
export class ApplicationServices {
  public constructor(
    @inject('CommandBus')
    private readonly commmandBus: ICommandBus,

    @inject('QueryBus')
    private readonly queryBus: IQueryBus
  ) {}

  public async executeCommand(command: ICommand<string>): Promise<void> {
    await this.commmandBus.execute(command);
  }

  public async execute<TQuery extends IQuery<string>>(
    query: TQuery['query']
  ): Promise<TQuery['response']> {
    return await this.queryBus.execute(query);
  }
}
