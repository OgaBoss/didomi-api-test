import { GetAllUsersQuery } from './GetAllUsersQuery';
import { PaginationQueryDto } from '../../common/dtos/PaginationQueryDto';

describe('GetAllUsersQuery', () => {
  it('should create an instance of GetAllUsersQuery', () => {
    const paginationQueryDto: PaginationQueryDto = {
      limit: 2,
      offset: 1,
    };
    const query = new GetAllUsersQuery(paginationQueryDto);
    expect(query.paginationQueryDto.offset).toBe(1);
    expect(query.paginationQueryDto.limit).toBe(2);
  });
});
