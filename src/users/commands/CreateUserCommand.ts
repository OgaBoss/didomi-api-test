import { CreateUserDto } from '../dtos/CreateUserDto';

export class CreateUserCommand {
  constructor(public readonly email: CreateUserDto) {}
}
