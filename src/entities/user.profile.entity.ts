import { Column, Entity, Index, JoinColumn, OneToOne } from 'typeorm';
import Model from './base.entity';
import { Gender } from 'src/common/enums/enums';
import { User } from './user.entity';

@Entity('user_profiles')
@Index('idx_user_profile_id', ['id'], { unique: true })
export class UserProfile extends Model {
  @Column({ name: 'user_id', nullable: false })
  userId: string;

  @Column({ name: 'full_name', nullable: false })
  fullName: string;

  @Column({
    type: 'enum',
    enum: Gender,
    nullable: false,
  })
  gender: Gender;

  @Column({
    name: 'phone_number',
    type: 'varchar',
    length: 20,
    nullable: false,
  })
  phoneNumber: string;

  @Column({ type: 'date', nullable: false })
  dateOfBirth: string;

  @Column({ name: 'profile_image', nullable: true })
  profileImage: string;

  @Column({ name: 'cover_image', nullable: true })
  coverImage: string;

  @OneToOne(() => User, (user) => user.userProfile, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
