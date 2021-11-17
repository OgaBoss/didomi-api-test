import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllUsersQuery } from './GetAllUsersQuery';
import { Repository } from 'typeorm';
import { User } from '../models/User';
import { InjectRepository } from '@nestjs/typeorm';
import { EventSourcedCurrentState } from '../../events/helpers/EventSourcedCurrentState';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly service: EventSourcedCurrentState,
  ) {}

  async execute(query: GetAllUsersQuery) {
    const { paginationQueryDto } = query;

    const users = await this.userRepository.find({
      // skip: paginationQueryDto.offset,
      // take: paginationQueryDto.limit,
    });

    return await Promise.all(
      users.map(async (user: User) => {
        user.consents = await this.service.getEventsCurrentStates(user.id);
        return user;
      }),
    );
  }
}
