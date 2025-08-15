import { Entity, Column, ManyToOne, Unique, JoinColumn } from 'typeorm';
import Model from './base.entity';
import { User } from './user.entity';

export enum FollowStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}

@Entity('user_follows')
@Unique(['follower', 'following']) // Prevent duplicate follows
export class UserFollow extends Model {
  @ManyToOne(() => User, (user) => user.following, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'follower_id' })
  follower: User;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'following_id' })
  following: User;

  @Column({
    name: 'followed_at',
    type: 'timestamp',
    nullable: true,
  })
  followedAt: Date;
}
