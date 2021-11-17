import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dtos/CreateEventDto';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Post()
  store(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvents(createEventDto);
  }
}
