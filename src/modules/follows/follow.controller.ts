import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { FollowService } from './follow.service';
import { ApiSecurityAuth } from 'src/common/decorators/swagger.decorator';
import { JwtAuthGuard } from 'src/shared/guards/local-auth.guard';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller('follows')
@ApiSecurityAuth()
@ApiTags('User Follows')
@UseGuards(JwtAuthGuard)
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('follow/:userId')
  async followUser(@Req() req: Request, @Param('userId') userId: string) {
    console.log('req.user', req.user);
    const currentUserId = req.user.id; // from auth
    console.log('currentUserId', currentUserId);
    console.log('userId:', userId);
    return this.followService.followUser(currentUserId, userId);
  }

  @Delete('unfollow/:userId')
  async unfollowUser(@Req() req: Request, @Param('userId') userId: string) {
    console.log('req.user.id:', req.user.id);
    return this.followService.unfollowUser(req.user.id, userId);
  }

  @Get('follower/:userId')
  async followers(@Param('userId') userId: string) {
    return this.followService.getFollowers(userId);
  }

  @Get('following/:userId')
  async following(@Param('userId') userId: string) {
    return this.followService.getFollowings(userId);
  }
}
