import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { SuccessInterceptor } from 'src/common/interceptors/success.interceptors';

@Controller('users')
@UseInterceptors(SuccessInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  getAllUsers() {
    return 'all users';
  }

  @Get(':id')
  getUser() {
    return 'one user';
  }

  @Post()
  createUser() {
    return 'create user';
  }
}
