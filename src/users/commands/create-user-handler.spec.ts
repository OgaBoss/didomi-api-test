import { Repository } from 'typeorm';
import { User } from '../models/User';
import { CreateUserHandler } from './CreateUserHandler';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from '../dtos/CreateUserDto';
import { CreateUserCommand } from './CreateUserCommand';

describe('CreateUserHandler', () => {
  let repository: Repository<User>;
  let handler: CreateUserHandler;
  const createUserDto: CreateUserDto = { email: 'test@test.com' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockResolvedValue(createUserDto),
            save: jest.fn().mockResolvedValue(createUserDto),
          },
        },
      ],
    }).compile();

    repository = module.get<Repository<User>>(getRepositoryToken(User));
    handler = module.get(CreateUserHandler);
  });

  it('should soft create user', async () => {
    const response = await handler.execute(
      new CreateUserCommand(createUserDto),
    );

    expect(repository.create).toBeCalledWith(createUserDto);
    expect(repository.create).toBeCalledTimes(1);
    expect(repository.save).toBeCalledTimes(1);
    expect(response.email).toBe(createUserDto.email);
  });
});
