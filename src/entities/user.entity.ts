import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToOne,
} from 'typeorm';
import Model from './base.entity';
import { Helper } from 'src/utils/helper';
import { UserProfile } from './user.profile.entity';

@Entity('users')
export class User extends Model {
  @Column({ nullable: false, unique: true }) // the column cannot contain NULL values.
  email: string;

  @Column({ nullable: true, name: 'user_name' })
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

  @ManyToMany(() => User, (user) => user.followers)
  @JoinTable() // Only on one side of the relationship
  following: User[];

  @ManyToMany(() => User, (user) => user.following)
  followers: User[];
}
