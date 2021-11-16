import { CreateEventDto } from '../dtos/CreateEventDto';

export class CreateEventCommand {
  constructor(public readonly createEventDto: CreateEventDto) {}
}
