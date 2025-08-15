import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { UserFollow } from 'src/entities/user.follow.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(UserFollow)
    private readonly followRepo: Repository<UserFollow>,
  ) {}

  async followUser(followerId: string, followingId: string) {
    // current=mine
    if (followerId === followingId) {
      throw new Error("You can't follow yourself");
    }
    const existing = await this.followRepo.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (existing) {
      throw new BadRequestException('Already following this user');
    }
    // this.followRepo.create({
    //   follower: { id: followerId } as User,
    //   following: { id: followingId } as User,
    // });
    const follow = this.followRepo.create({
      follower: { id: followerId } as User,
      following: { id: followingId } as User,
    });

    return this.followRepo.save(follow);
  }

  async unfollowUser(followerId: string, followingId: string) {
    const follow = await this.followRepo.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
    if (!follow) {
      throw new NotFoundException('You are not following this user');
    }
    return this.followRepo.remove(follow);
  }

  async requestFollow(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }
    const existing = await this.followRepo.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
    if (existing) {
      throw new BadRequestException('Follow request already exists');
    }

    // const follow = await this.followRepo.create({
    //   follower: { id: followerId },
    //   following: { id: followingId },
    //   status: FollowStatus.PENDING,
    // });
    // return this.followRepo.save(follow);
  }

  // Get all followers of a user
  async getFollowers(userId: string) {
    const followers = await this.followRepo.find({
      where: { following: { id: userId } },
      relations: ['follower', 'follower.userProfile'],
      select: {
        follower: {
          password: false,
          email: true,
          userName: true,
          userProfile: {
            fullName: true,
            profileImage: true,
            coverImage: true,
          },
        },
      },
    });
    return followers.map((f) => f.follower); // returns just the follower users
  }

  async getFollowings(userId: string) {
    const followings = await this.followRepo.find({
      where: { follower: { id: userId } },
      relations: ['following', 'following.userProfile'],
      select: {
        following: {
          password: false,
          email: true,
          userName: true,
          userProfile: {
            fullName: true,
            profileImage: true,
            coverImage: true,
          },
        },
      },
    });
    return followings.map((f) => f.following); // returns just the following users
  }
}
