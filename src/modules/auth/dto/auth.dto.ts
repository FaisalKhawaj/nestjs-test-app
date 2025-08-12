import { ApiProperty } from '@nestjs/swagger';

import {
  IsEmail,
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
} from 'class-validator';

export class AuthDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
    type: 'string',
  })
  @IsEmail({}, { message: 'email must be a valid email' })
  @IsNotEmpty({ message: 'email is required' })
  email: string;

  @ApiProperty({
    example: 'Password@12',
    type: 'string',
    description:
      'The password of the user password should be at least 6 and max 50 characters long and contain at least one upper letter, number and a special character',
  })
  @IsString()
  @MinLength(3, { message: 'password should be at least 3 characters long' })
  @MaxLength(50, {
    message: 'password should not be longer than 50 characters',
  })
  password: string;
}
