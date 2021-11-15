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

export const CommandHandlers = [CreateUserHandler];

@Module({
  imports: [TypeOrmModule.forFeature([User, Consent]), CqrsModule],
  controllers: [UsersController],
  providers: [UsersService, EmailExistsRule, ...CommandHandlers, Repository],
  exports: [],
})
export class UsersModule {}
