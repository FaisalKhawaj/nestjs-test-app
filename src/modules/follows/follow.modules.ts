import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';
import { UserFollow } from 'src/entities/user.follow.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserFollow])],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
