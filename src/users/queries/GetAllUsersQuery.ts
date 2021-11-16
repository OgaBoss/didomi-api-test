import { PaginationQueryDto } from '../../common/dtos/PaginationQueryDto';

export class GetAllUsersQuery {
  constructor(public readonly paginationQueryDto: PaginationQueryDto) {}
}
