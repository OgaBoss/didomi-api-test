import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { User } from '../models/User';
import { InjectRepository } from '@nestjs/typeorm';
import { GetUserQuery } from './GetUserQuery';
import { NotFoundException } from '@nestjs/common';
import { EventSourcedCurrentState } from '../../events/helpers/EventSourcedCurrentState';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly service: EventSourcedCurrentState,
  ) {}

  async execute(query: GetUserQuery) {
    const { user_id } = query;
    const user: User = await this.userRepository.findOne(user_id);

    if (!user) {
      throw new NotFoundException(`User with id #${user_id} not found`);
    }
    const consents = await this.service.getEventsCurrentStates(user_id);
    return { ...user, consents };
  }
}
