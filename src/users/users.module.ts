import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/User';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CqrsModule } from '@nestjs/cqrs';
import { EmailExistsRule } from '../validation/Rules/EmailExistsRule';
import { CreateUserHandler } from './commands/CreateUserHandler';
import { Repository } from 'typeorm';
import { Consent } from '../consents/models/Consent';
import { GetAllUsersHandler } from './queries/GetAllUsersHandler';
import { GetUserHandler } from './queries/GetUserHandler';
import { DeleteUserHandler } from './commands/DeleteUserHandler';

export const CommandHandlers = [CreateUserHandler, DeleteUserHandler];
export const QueryHandlers = [GetAllUsersHandler, GetUserHandler];

@Module({
  imports: [TypeOrmModule.forFeature([User, Consent]), CqrsModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    EmailExistsRule,
    ...CommandHandlers,
    ...QueryHandlers,
    Repository,
  ],
  exports: [],
})
export class UsersModule {}
