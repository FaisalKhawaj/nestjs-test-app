import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FollowUserDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
}

export class UnfollowUserDto {
  @ApiProperty()
  @IsUUID()
  userId: string;
}
