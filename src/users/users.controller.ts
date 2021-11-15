import { Body, Controller, Query, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationQueryDto } from '../common/dtos/PaginationQueryDto';
import { CreateUserDto } from './dtos/CreateUserDto';
import { ApiTags } from '@nestjs/swagger';
import { User } from './models/User';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  // index(@Query() paginationQueryDto: PaginationQueryDto) {}

  @Post()
  store(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUser(createUserDto);
  }
}
