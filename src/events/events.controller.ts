import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dtos/CreateEventDto';
import { EventsService } from './events.service';
import { GetResponseInterceptor } from '../users/interceptors/GetResponseInterceptor';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventService: EventsService) {}

  @Post()
  store(@Body() createEventDto: CreateEventDto) {
    return this.eventService.createEvents(createEventDto);
  }
}
