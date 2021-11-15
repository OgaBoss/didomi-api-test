import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dtos/CreateUserDto';
import { CreateUserCommand } from './commands/CreateUserCommand';

@Injectable()
export class UsersService {
  constructor(private commandBus: CommandBus) {}

  async createUser(createUserDto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }
}
