import {
  Body,
  Controller,
  Query,
  Post,
  Get,
  UseInterceptors,
  Param,
  Delete,
  UseFilters,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { PaginationQueryDto } from '../common/dtos/PaginationQueryDto';
import { CreateUserDto } from './dtos/CreateUserDto';
import { ApiTags } from '@nestjs/swagger';
import { GetResponseInterceptor } from './interceptors/GetResponseInterceptor';
import { BadRequestExceptionFilter } from './filters/BadRequestExceptionFilter';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @UseInterceptors(new GetResponseInterceptor())
  index(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.userService.findAllUsers(paginationQueryDto);
  }

  @Get(':user_id')
  @UseInterceptors(new GetResponseInterceptor())
  find(@Param('user_id') user_id: string) {
    return this.userService.findUser(user_id);
  }

  @Post()
  @UseFilters(new BadRequestExceptionFilter())
  @UseInterceptors(new GetResponseInterceptor())
  store(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Delete(':user_id')
  destroy(@Param('user_id') user_id: string) {
    return this.userService.deleteUser(user_id);
  }
}
