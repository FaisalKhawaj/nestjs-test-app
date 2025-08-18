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
  Req,
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
import { CreateCommentDto } from './dto/create-comment.dto';

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

  // get specific user posts details
  @Get('/user/:userId')
  @ApiOperation({ summary: 'getting specific users  post' })
  @ApiResponse({
    status: 201,
    description: 'specific Post fetched successfully.',
  })
  getUserPost(
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @Query() filter: PaginationDto,
  ) {
    return this.userPostService.getUserPost(userId, filter);
  }

  // delete all posts of loggedin user
  @Delete('/delete-all-posts/:userId')
  @ApiOperation({ summary: 'Delete all posts of a user' })
  @ApiResponse({ status: 200, description: 'All posts deleted successfully.' })
  deleteAllPostUser(@Param('userId') userId: string, @Req() req: any) {
    return this.userPostService.deleteAllPostUser(userId, req.user.id);
  }

  // delete specific post of loggedin user
  @Delete('/delete-post/:postId')
  @ApiOperation({ summary: 'Delete specific post of a user' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully.' })
  deletePostUser(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Req() req: any,
  ) {
    return this.userPostService.deletePostUser(postId, req.user.id);
  }

  // like unliking post
  @Post('/:postId/likes/toggle')
  @ApiOperation({ summary: 'Like/Unlike a post' })
  @ApiResponse({ status: 201, description: 'Post liked successfully.' })
  toggleLikePost(
    @Param('postId', ParseUUIDPipe) postId: string,
    @Req() req: any,
  ) {
    return this.userPostService.toggleLikePost(postId, req.user.id);
    //
  }

  @Post(':postId/comment')
  @ApiOperation({ summary: 'Comment on a post' })
  @ApiResponse({ status: 201, description: 'Comment added successfully.' })
  commentOnPost(
    @Req() req: any,
    @Param('postId', ParseUUIDPipe) postId: string,
    @Body() body: CreateCommentDto,
  ) {
    const userId = req.user.id;
    return this.userPostService.commentOnPost(userId, postId, body);
    //
  }
}
