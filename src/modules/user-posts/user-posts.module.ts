import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPost } from 'src/entities/user.posts.entity';
import { UserComment } from 'src/entities/userComments.entity';
import { UserLike } from 'src/entities/userLike.entity';
import { UserPostsService } from './user-posts.service';
import { UserPostsController } from './user-posts.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserPost, UserLike, UserComment])], // Import the Post entity
  controllers: [UserPostsController],
  providers: [UserPostsService],
})
export class UserPostsModule {}
