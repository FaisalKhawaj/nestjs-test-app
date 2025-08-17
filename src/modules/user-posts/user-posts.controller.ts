import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { INTERNAL_SERVER_ERROR_RESPONSE } from 'src/common/constants/http-responses.types';
import { ApiErrorDecorator } from 'src/common/decorators/error.decorator';
import { ApiSecurityAuth } from 'src/common/decorators/swagger.decorator';
import { JwtAuthGuard } from 'src/shared/guards/local-auth.guard';
import { UserPostsService } from './user-posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
@UseGuards(JwtAuthGuard)
@ApiTags('User Posts')
@ApiSecurityAuth()
@Controller('posts')
export class UserPostsController {
  constructor(private readonly userPostService: UserPostsService) {}

  @Post('/create-post')
  @ApiOperation({ summary: 'Creating a new post' })
  @ApiResponse({ status: 201, description: 'Post created successfully.' })
  createPost(@Body() body: CreatePostDto) {
    return this.userPostService.createPost(body);
  }

  @Get('/all-posts')
  @ApiOperation({ summary: 'getting all users  post' })
  @ApiResponse({ status: 201, description: 'Post fetched successfully.' })
  getAllPosts(@Query() filter: PaginationDto) {
    return this.userPostService.getPosts(filter);
  }

  @Get('/user/:userId')
  @ApiOperation({ summary: 'getting specific users  post' })
  @ApiResponse({
    status: 201,
    description: 'specific Post fetched successfully.',
  })
  getUserPost(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() filter: PaginationDto,
  ) {
    return this.userPostService.getUserPost(userId, filter);
  }

  @Delete('/delete-post/:userId')
  @ApiOperation({ summary: 'Delete all posts of a user' })
  @ApiResponse({ status: 200, description: 'All posts deleted successfully.' })
  deleteAllPostUser(@Param('userId') userId: string) {
    return this.userPostService.deleteAllPostUser(userId);
  }
}
