import { Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UserService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UserService) {} // DI

  // all users
  @ApiOperation({ summary: 'All Users lists' })
  @Get('/all-users')
  getAllUsers(): string {
    return this.userService.getAllUsers();
  }
}
