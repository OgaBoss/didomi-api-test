import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserCommand } from './CreateUserCommand';
import { Repository } from 'typeorm';
import { User } from '../models/User';
import { InjectRepository } from '@nestjs/typeorm';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { email } = command;

    const user = this.userRepository.create({ ...email });
    return this.userRepository.save(user);
  }
}
