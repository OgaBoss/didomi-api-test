import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAllUsersQuery } from './GetAllUsersQuery';
import { Repository } from 'typeorm';
import { User } from '../models/User';
import { InjectRepository } from '@nestjs/typeorm';

@QueryHandler(GetAllUsersQuery)
export class GetAllUsersHandler implements IQueryHandler<GetAllUsersQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: GetAllUsersQuery) {
    const { paginationQueryDto } = query;

    return await this.userRepository.find({
      relations: ['consent'],
      skip: paginationQueryDto.offset,
      take: paginationQueryDto.limit,
    });
  }
}
