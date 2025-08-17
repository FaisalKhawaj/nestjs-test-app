import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import Model from './base.entity';
import { ContentTypes } from 'src/common/enums/enums';
import { User } from './user.entity';
import { UserLike } from './userLike.entity';
import { UserComment } from './userComments.entity';

@Entity('user_posts')
export class UserPost extends Model {
  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({
    name: 'content_type',
    type: 'enum',
    enum: ContentTypes,
    nullable: true,
  })
  contentType: ContentTypes;

  // @Column('text', { array: true, default: [] })
  @Column({
    type: 'text',
    array: true,
    default: () => "ARRAY['']::text[]", // default ['']
  })
  content: string[]; // Can be text, image URL, video URL, or audio URL

  @Column({ nullable: true })
  caption?: string;

  @Column({ name: 'likes_counts', default: 0 })
  likesCount: number;

  @Column({ name: 'comments_counts', default: 0 })
  commentsCount: number;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => UserLike, (like) => like.post, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  likes: UserLike[];

  @OneToMany(() => UserComment, (comment) => comment.post)
  comments: UserComment[];
}
