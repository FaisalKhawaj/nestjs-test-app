import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import Model from './base.entity';
import { User } from './user.entity';
import { UserLike } from './userLike.entity';
import { UserPost } from './user.posts.entity';

@Entity('user_comments')
// @Tree('nested-set')
export class UserComment extends Model {
  @Index()
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Index()
  @Column({ name: 'post_id', nullable: true })
  postId: string;

  // Self-referencing for nested comments
  @Index()
  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: 0 })
  likesCount: number;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => UserPost, (post) => post.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: UserPost;

  @ManyToOne(() => UserComment, (comment) => comment.children, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: UserComment;

  @OneToMany(() => UserComment, (comment) => comment.parent, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  children: UserComment[];

  @OneToMany(() => UserLike, (likes) => likes.comments)
  likes: UserComment[];
}
