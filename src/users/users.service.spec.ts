import { Test, TestingModule } from '@nestjs/testing';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { UsersService } from './users.service';
import { PaginationQueryDto } from '../common/dtos/PaginationQueryDto';
import { GetAllUsersQuery } from './queries/GetAllUsersQuery';
import { GetUserQuery } from './queries/GetUserQuery';
import { CreateUserDto } from './dtos/CreateUserDto';
import { CreateUserCommand } from './commands/CreateUserCommand';
import { DeleteUserCommand } from './commands/DeleteUserCommand';

describe('UsersService', () => {
  let service: UsersService;
  let commandBusMock: CommandBus;
  let queryBusMock: QueryBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    commandBusMock = module.get<CommandBus>(CommandBus);
    queryBusMock = module.get<QueryBus>(QueryBus);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Queries', () => {
    it('query bus should be defined', () => {
      expect(queryBusMock).toBeDefined();
    });

    it('FindAllUsers', async () => {
      const queryParams: PaginationQueryDto = {
        limit: 1,
        offset: 1,
      };
      await service.findAllUsers(queryParams);
      expect(queryBusMock.execute).toBeCalledTimes(1);
      expect(queryBusMock.execute).toBeCalledWith(
        new GetAllUsersQuery(queryParams),
      );
    });

    it('FindUser', async () => {
      const user_id = '39af21a5-3920-44de-9d8c-3ccced178d60';
      await service.findUser(user_id);
      expect(queryBusMock.execute).toBeCalledTimes(1);
      expect(queryBusMock.execute).toBeCalledWith(new GetUserQuery(user_id));
    });
  });

  describe('Commands', () => {
    it('CreateUser', async () => {
      const createUserDto: CreateUserDto = { email: 'test@test.com' };
      await service.createUser(createUserDto);
      expect(commandBusMock.execute).toBeCalledTimes(1);
      expect(commandBusMock.execute).toBeCalledWith(
        new CreateUserCommand(createUserDto),
      );
    });

    it('deleteUser', async () => {
      const user_id = '39af21a5-3920-44de-9d8c-3ccced178d60';
      await service.deleteUser(user_id);
      expect(commandBusMock.execute).toBeCalledTimes(1);
      expect(commandBusMock.execute).toBeCalledWith(
        new DeleteUserCommand(user_id),
      );
    });
  });
});
