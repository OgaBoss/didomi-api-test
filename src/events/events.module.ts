import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/models/User';
import { CqrsModule } from '@nestjs/cqrs';
import { EventsController } from './events.controller';
import { CreateEventHandler } from './commands/CreateEventHandler';
import { Repository } from 'typeorm';
import { Event } from './models/Event';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';

export const CommandHandlers = [CreateEventHandler];

@Module({
  imports: [TypeOrmModule.forFeature([User, Event]), CqrsModule, UsersModule],
  controllers: [EventsController],
  providers: [EventsService, ...CommandHandlers, Repository, UsersService],
  exports: [],
})
export class EventsModule {}
