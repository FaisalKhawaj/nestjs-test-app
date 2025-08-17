import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import Model from './base.entity';
import { ContentTypes } from 'src/common/enums/enums';
import { User } from './user.entity';

@Entity('user-posts')
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

  @Column({ name: 'content', type: 'text' })
  content: string; // Can be text, image URL, video URL, or audio URL

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
}
