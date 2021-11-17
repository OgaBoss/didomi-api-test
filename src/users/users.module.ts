import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/User';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailExistsRule } from '../validation/Rules/EmailExistsRule';
import { CreateUserHandler } from './commands/CreateUserHandler';
import { Repository } from 'typeorm';
import { GetAllUsersHandler } from './queries/GetAllUsersHandler';
import { GetUserHandler } from './queries/GetUserHandler';
import { DeleteUserHandler } from './commands/DeleteUserHandler';
import { EventSourcedCurrentState } from '../events/helpers/EventSourcedCurrentState';
import { Event } from '../events/models/Event';

export const CommandHandlers = [CreateUserHandler, DeleteUserHandler];
export const QueryHandlers = [GetAllUsersHandler, GetUserHandler];

@Module({
  imports: [TypeOrmModule.forFeature([User, Event]), CqrsModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    EmailExistsRule,
    ...CommandHandlers,
    ...QueryHandlers,
    Repository,
    EventSourcedCurrentState,
  ],
  exports: [],
})
export class UsersModule {}
