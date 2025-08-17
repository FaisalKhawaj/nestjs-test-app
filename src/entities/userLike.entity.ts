import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Model from './base.entity';
import { UserPost } from './user.posts.entity';
import { UserComment } from './userComments.entity';
import { User } from './user.entity';

@Entity('user_likes')
export class UserLike extends Model {
  //
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'post_id', nullable: true })
  postId: string;

  @Column({ name: 'comment_id', nullable: true })
  commentId: string;

  @ManyToOne(() => User, (user) => user.likes, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => UserPost, (post) => post.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: UserPost;

  @ManyToOne(() => UserComment, (um) => um.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comments: UserComment;
}
