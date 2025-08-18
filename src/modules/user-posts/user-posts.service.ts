import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserPost } from 'src/entities/user.posts.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { PaginationResponse } from 'src/common/dto/pagination-response.dto';
import { Helper } from 'src/utils/helper';
import { UserLike } from 'src/entities/userLike.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UserComment } from 'src/entities/userComments.entity';

@Injectable()
export class UserPostsService {
  constructor(
    @InjectRepository(UserPost)
    private readonly postRepository: Repository<UserPost>,
    @InjectRepository(UserLike)
    private readonly postLikeRespository: Repository<UserLike>,

    @InjectRepository(UserComment)
    private readonly postCommentRepository: Repository<UserComment>,
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

  async deleteAllPostUser(userId: string, reqUserId) {
    if (userId !== reqUserId) {
      throw new UnauthorizedException('You can only delete your own posts');
    }
    if (userId === reqUserId)
      await this.postRepository.delete({ userId: userId });
    return {
      statusCode: 200,
      message: 'All posts deleted successfully.',
    };
  }

  async deletePostUser(postId: string, userId: string) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    console.log('post', post);
    if (!post) {
      throw new NotFoundException(`Post not found`);
    }
    if (post.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this post');
    }
    await this.postRepository.delete({ id: postId });
    return { message: 'Post deleted successfully', data: [] };
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

  //
  async toggleLikePost(
    postId,
    requestUserId,
  ): Promise<{ message: string; data: any }> {
    const post = await this.postRepository.findOne({
      where: { id: postId },
      relations: { likes: true },
    });
    if (!post) throw new NotFoundException('Post not found');
    const isLike = await this.postLikeRespository.findOne({
      where: { postId: postId, userId: requestUserId },
    });
    // already liking a post
    if (isLike) {
      await this.postLikeRespository.delete({
        postId: postId,
        userId: requestUserId,
      });
      await this.postRepository.decrement({ id: postId }, 'likesCount', 1);
      return { message: 'Post unliked successfully', data: null };
    }
    const newLike = this.postLikeRespository.create({
      postId,
      userId: requestUserId,
    });
    await this.postLikeRespository.save(newLike);
    await this.postRepository.increment({ id: postId }, 'likesCount', 1);
    return { message: 'Post liked successfully', data: null };

    //
  }

  async commentOnPost(
    userId: string,
    postId: string,
    body: CreateCommentDto,
  ): Promise<{ message: string; data: UserComment }> {
    const { content, parentId } = body;

    // 1. Validate post exists
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }

    // 2. If reply, validate parent comment exists
    let parentComment: UserComment | null = null;
    if (parentId) {
      parentComment = await this.postCommentRepository.findOne({
        where: { id: parentId, postId }, // ensures parent belongs to same post
      });
      if (!parentComment) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    // 3. Create new comment
    const newComment = this.postCommentRepository.create({
      userId,
      postId,
      parentId: parentId || null,
      content,
    });

    await this.postCommentRepository.save(newComment);

    // 4. Increment post.commentsCount
    await this.postRepository.increment({ id: postId }, 'commentsCount', 1);

    return {
      message: parentId
        ? 'Reply added successfully'
        : 'Comment added successfully',
      data: newComment,
    };
  }
}
