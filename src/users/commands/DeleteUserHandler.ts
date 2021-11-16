import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { User } from '../models/User';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteUserCommand } from './DeleteUserCommand';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: DeleteUserCommand) {
    const { user_id } = command;

    const response = await this.userRepository.softDelete(user_id);

    if (!response.affected) {
      throw new NotFoundException(`User with id #${user_id} not found`);
    }

    return {
      message: `User with id #${user_id} successfully removed`,
    };
  }
}
