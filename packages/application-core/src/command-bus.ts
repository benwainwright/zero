import type { AbstractService } from './abstract-service.ts';
import type { Command } from './command.ts';

export class CommandBus {
  public constructor(private readonly services: AbstractService<Command>[]) {}

  public async execute(command: Command) {
    const theCorrectService = this.services.find((service) =>
      service.canHandle(command)
    );

    await theCorrectService?.doHandle({ command });
  }
}
