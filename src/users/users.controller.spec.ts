import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PaginationQueryDto } from '../common/dtos/PaginationQueryDto';
import { CreateUserDto } from './dtos/CreateUserDto';

describe('UsersController', () => {
  let service: UsersService;
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAllUsers: jest.fn(),
            findUser: jest.fn(),
            createUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    controller = module.get<UsersController>(UsersController);
  });

  it('user controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('user service be defined', () => {
    expect(service).toBeDefined();
  });

  it('Index', async () => {
    const queryParams: PaginationQueryDto = {
      limit: 1,
      offset: 1,
    };

    await controller.index(queryParams);
    expect(service.findAllUsers).toBeCalledTimes(1);
    expect(service.findAllUsers).toBeCalledWith(queryParams);
  });

  it('Find', async () => {
    const user_id = '39af21a5-3920-44de-9d8c-3ccced178d60';
    await controller.find(user_id);

    expect(service.findUser).toBeCalledTimes(1);
    expect(service.findUser).toBeCalledWith(user_id);
  });

  it('Store', async () => {
    const createUserDto: CreateUserDto = { email: 'test@test.com' };
    await controller.store(createUserDto);

    expect(service.createUser).toBeCalledTimes(1);
    expect(service.createUser).toBeCalledWith(createUserDto);
  });

  it('Destroy', async () => {
    const user_id = '39af21a5-3920-44de-9d8c-3ccced178d60';
    await controller.destroy(user_id);

    expect(service.deleteUser).toBeCalledTimes(1);
    expect(service.deleteUser).toBeCalledWith(user_id);
  });
});
