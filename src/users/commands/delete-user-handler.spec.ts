import { Repository, UpdateResult } from 'typeorm';
import { User } from '../models/User';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteUserHandler } from './DeleteUserHandler';
import { DeleteUserCommand } from './DeleteUserCommand';

describe('DeleteUserHandler', () => {
  let repository: Repository<User>;
  let handler: DeleteUserHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserHandler,
        {
          provide: getRepositoryToken(User),
          useValue: {
            softDelete: jest.fn().mockResolvedValue({ affected: 1 }),
          },
        },
      ],
    }).compile();

    repository = module.get<Repository<User>>(getRepositoryToken(User));
    handler = module.get(DeleteUserHandler);
  });

  it('should soft delete user', async () => {
    const user_id = '39af21a5-3920-44de-9d8c-3ccced178d60';

    const response = await handler.execute(new DeleteUserCommand(user_id));
    expect(repository.softDelete).toBeCalledWith(user_id);
    expect(repository.softDelete).toBeCalledTimes(1);
    expect(response.message).toBe(
      `User with id #${user_id} successfully removed`,
    );
  });

  it('should return not found exception if user is not deleted', async () => {
    const user_id = '39af21a5-3920-44de-9d8c-3ccced178d60';

    try {
      const response = new UpdateResult();
      response.affected = 0;
      jest.spyOn(repository, 'softDelete').mockResolvedValue(response);

      await handler.execute(new DeleteUserCommand(user_id));
    } catch (e) {
      expect(e.message).toBe(`User with id #${user_id} not found`);
    }
  });
});
