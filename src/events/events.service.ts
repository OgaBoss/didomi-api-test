import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dtos/CreateEventDto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateEventCommand } from './commands/CreateEventCommand';

@Injectable()
export class EventsService {
  constructor(private readonly commandBus: CommandBus) {}

  async createEvents(createEventsDto: CreateEventDto) {
    return this.commandBus.execute(new CreateEventCommand(createEventsDto));
  }
}
