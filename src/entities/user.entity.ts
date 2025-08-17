import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  OneToOne,
} from 'typeorm';
import Model from './base.entity';
import { Helper } from 'src/utils/helper';
import { UserProfile } from './user.profile.entity';
import { UserFollow } from './user.follow.entity';
import { UserPost } from './user.posts.entity';
import { UserLike } from './userLike.entity';
import { UserComment } from './userComments.entity';

@Entity('users')
@Index('idx_user_id', ['id'], { unique: true })
@Index('idx_user_name', ['userName'], { unique: true })
@Index('idx_user_email', ['email'], { unique: true })
export class User extends Model {
  @Column({ nullable: false, unique: true }) // the column cannot contain NULL values.
  email: string;

  @Column({ nullable: true, name: 'user_name', unique: true })
  userName: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    name: 'otp_code',
    type: 'varchar',
    length: 25,
    nullable: true,
    default: null,
  })
  otpCode: string;

  @Column({
    name: 'otp_expiry',
    type: 'timestamp',
    nullable: true,
    default: null,
  })
  otpExpiry: Date;

  @Column({ name: 'is_active', type: 'boolean', nullable: true, default: true })
  isActive: boolean;

  @Column({
    name: 'is_forgot_password',
    type: 'boolean',
    default: false,
  })
  isForgotPassword: boolean;

  @Column({
    name: 'state',
    nullable: false,
  })
  state: string;

  @Column({
    name: 'country',
    nullable: false,
  })
  country: string;

  @Column({
    name: 'city',
    nullable: false,
  })
  city: string;

  @Column({ name: 'notification_enabled', type: 'boolean', default: true })
  notificationEnabled: boolean;

  @Column({ name: 'is_blocked', type: 'boolean', default: false })
  isBlocked: boolean;

  @Column({ name: 'is_verified', default: false })
  isVerified: boolean;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await Helper.hashPassword(this.password);
    }
  }

  @OneToOne(() => UserProfile, (userProfile) => userProfile.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userProfile: UserProfile;

  @OneToMany(() => UserFollow, (follow) => follow.follower)
  following: UserFollow[];

  @OneToMany(() => UserFollow, (follow) => follow.following)
  followers: UserFollow[];

  @OneToMany(() => UserPost, (userPost) => userPost.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  posts: UserPost[];

  @OneToMany(() => UserLike, (like) => like.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  likes: UserLike[];

  @OneToMany(() => UserComment, (comment) => comment.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  comments: UserComment[];
}
