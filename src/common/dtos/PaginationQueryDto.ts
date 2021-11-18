import { IsNumber, IsOptional } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumber()
  limit = 0;

  @IsOptional()
  @IsNumber()
  offset = 0;
}
