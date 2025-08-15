import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';

import { UserService } from './users.service';
import { ChangePasswordDto } from './dto/update-password.dto';
import { JwtAuthGuard } from 'src/shared/guards/local-auth.guard';
import { ApiSecurityAuth } from 'src/common/decorators/swagger.decorator';
import { ApiErrorDecorator } from 'src/common/decorators/error.decorator';
import { INTERNAL_SERVER_ERROR_RESPONSE } from 'src/common/constants/http-responses.types';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@ApiTags('Users')
@ApiErrorDecorator(HttpStatus.BAD_REQUEST, 'Bad Request')
@ApiErrorDecorator(HttpStatus.UNAUTHORIZED, 'Unauthorized')
@ApiErrorDecorator(HttpStatus.UNAUTHORIZED, 'Token is invalid')
@ApiErrorDecorator(HttpStatus.UNAUTHORIZED, 'Token is expired')
@ApiErrorDecorator(HttpStatus.UNAUTHORIZED, 'Token is missing')
@ApiErrorDecorator(HttpStatus.UNAUTHORIZED, 'Token is malformed')
@ApiErrorDecorator(HttpStatus.UNPROCESSABLE_ENTITY, 'Unprocessable Entity')
@ApiErrorDecorator(HttpStatus.NOT_FOUND, 'Not Found')
@ApiErrorDecorator(HttpStatus.FORBIDDEN, 'Access Forbidden')
@ApiErrorDecorator(
  INTERNAL_SERVER_ERROR_RESPONSE.status as number,
  INTERNAL_SERVER_ERROR_RESPONSE.message,
)
@Controller('users')
@ApiSecurityAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UserService) {} // DI

  // all users
  @ApiOperation({ summary: 'User listing' })
  @ApiOkResponse()
  @HttpCode(200)
  @Get('/all')
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  findAll(@Req() req: Request, @Query() paginationDto: PaginationDto) {
    const user = req.user;
    return this.userService.findAll(user.id, paginationDto);
  }

  @ApiOperation({ summary: 'Get user details by Id' })
  @ApiOkResponse()
  @HttpCode(200)
  @Get('/:id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Update User Password' })
  @Patch('change-password/:userId')
  updateUserPassword(
    @Body() body: ChangePasswordDto,
    @Param('userId') userId: string,
  ) {
    return this.userService.updateUserPassword(body, userId);
  }

  @ApiOperation({ summary: 'Delete user' })
  @ApiOkResponse()
  @HttpCode(200)
  @Delete('/permanent-deleter/:id')
  async deleteUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.deleteUser(id);
  }

  @ApiOperation({ summary: 'Remove user' })
  @ApiOkResponse()
  @HttpCode(200)
  @Delete('/deleter/:id')
  async removeUser(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.userService.softDeleteUser(id);
  }
}
