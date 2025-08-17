import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPost } from 'src/entities/user.posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationResponse } from 'src/common/dto/pagination-response.dto';
import { Helper } from 'src/utils/helper';

@Injectable()
export class UserPostsService {
  constructor(
    @InjectRepository(UserPost)
    private readonly postRepository: Repository<UserPost>,
  ) {}

  async createPost(payload: CreatePostDto): Promise<UserPost> {
    const post = this.postRepository.create({
      ...payload,
      content:
        payload.content && payload.content.length > 0 ? payload.content : [''],
    });
    return await this.postRepository.save(post);
    //
  }

  async deleteAllPostUser(userId: string) {
    await this.postRepository.delete({ userId: userId });
  }

  async getPosts({
    skip,
    limit,
    page,
  }: PaginationDto): Promise<PaginationResponse<UserPost>> {
    const data = await this.postRepository.findAndCount({
      relations: {
        user: { userProfile: true, posts: true },
      },
      select: {
        id: true,
        content: true,
        contentType: true,
        commentsCount: true,
        comments: true,
        likes: true,
        likesCount: true,
        createdAt: true,
        updatedAt: true,
        user: {
          userName: true,
          email: true,
          id: true,
          userProfile: {
            id: true,
            fullName: true,
            coverImage: true,
            profileImage: true,
          },
        },
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    const finalResponse: PaginationResponse<UserPost> = Helper.paginateResponse(
      {
        data: data,
        page,
        limit,
      },
    );
    return finalResponse;
  }

  async getUserPost(userId: string, filter: PaginationDto) {
    const { skip, limit, page } = filter;
    const data = await this.postRepository.findAndCount({
      where: { user: { id: userId } },
      relations: { user: { userProfile: true } },
      select: {
        id: true,
        contentType: true,
        content: true,
        caption: true,
        comments: true,
        createdAt: true,
        deletedAt: true,
        user: {
          email: true,
          userName: true,
          userProfile: {
            fullName: true,
            profileImage: true,
            coverImage: true,
          },
        },
      },
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    const finalResponse: PaginationResponse<UserPost> = Helper.paginateResponse(
      {
        data: data,
        page,
        limit,
      },
    );
    return finalResponse;
  }

  // async getPosts({
  //   skip,
  //   limit,
  //   page,
  // }: PaginationDto): Promise<PaginationResponse<UserPost>> {
  //   const qb = this.postRepository
  //     .createQueryBuilder('post')
  //     .leftJoinAndSelect('post.user', 'user')
  //     .leftJoinAndSelect('user.userProfile', 'userProfile')
  //     .leftJoinAndSelect('post.comments', 'comments')
  //     .leftJoinAndSelect('post.likes', 'likes')
  //     .select([
  //       'post.id',
  //       'post.content',
  //       'post.contentType',
  //       'post.commentsCount',
  //       'post.likesCount',
  //       'post.createdAt',
  //       'post.updatedAt',
  //       'user.id',
  //       'user.userName',
  //       'user.email',
  //       'userProfile.id',
  //       'userProfile.fullName',
  //       'userProfile.coverImage',
  //       'userProfile.profileImage',
  //       // comments & likes are joined, you can select fields if needed
  //       'comments.id',
  //       'comments.content',
  //       'likes.id',
  //     ])
  //     .orderBy('post.createdAt', 'DESC')
  //     .skip(skip)
  //     .take(limit);

  //   const [items, total] = await qb.getManyAndCount();

  //   return Helper.paginateResponse({
  //     data: [items, total],
  //     page,
  //     limit,
  //   });
  // }
}
