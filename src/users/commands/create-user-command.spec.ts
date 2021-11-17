import { CreateUserCommand } from './CreateUserCommand';
import { CreateUserDto } from '../dtos/CreateUserDto';

describe('CreateUserCommand', () => {
  it('should create an instance of CreateUserCommand', () => {
    const createUserDto: CreateUserDto = { email: 'test@test.com' };

    const command = new CreateUserCommand(createUserDto);
    expect(command.email.email).toBe(createUserDto.email);
  });
});
