import { Gender } from 'src/common/enums/enums';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import Model from './base.entity';

@Entity('users')
export class User extends Model {
  @Column({ type: 'text' })
  fullName: string;

  @Column({ nullable: false, unique: true }) // the column cannot contain NULL values.
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, name: 'user_name' })
  userName: string;

  @Column({
    name: 'otp_code',
    type: 'varchar',
    length: 25,
    nullable: true,
    default: null,
  })
  otpCode: string;

  @Column({ type: 'enum', enum: Gender, nullable: false })
  gender: Gender;

  @Column({ type: 'date', nullable: false })
  dateOfBirth: string;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  phoneNumber: string;

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
}
