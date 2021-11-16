import { Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserDto } from './dtos/CreateUserDto';
import { CreateUserCommand } from './commands/CreateUserCommand';
import { PaginationQueryDto } from '../common/dtos/PaginationQueryDto';
import { GetAllUsersQuery } from './queries/GetAllUsersQuery';
import { GetUserQuery } from './queries/GetUserQuery';
import { DeleteUserCommand } from './commands/DeleteUserCommand';

@Injectable()
export class UsersService {
  constructor(private commandBus: CommandBus, private queryBus: QueryBus) {}

  async findAllUsers(paginationQueryDto: PaginationQueryDto) {
    return this.queryBus.execute(new GetAllUsersQuery(paginationQueryDto));
  }

  async findUser(user_id: string) {
    return this.queryBus.execute(new GetUserQuery(user_id));
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.commandBus.execute(new CreateUserCommand(createUserDto));
  }

  async deleteUser(user_id: string) {
    return this.commandBus.execute(new DeleteUserCommand(user_id));
  }
}
