import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/enums/enums';

export class SignupDto {
  @ApiProperty({
    name: 'fullName',
    example: 'Faisal Khawaj',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty({ message: 'Full name is required' })
  fullName: string;

  @ApiProperty({
    name: 'userName',
    type: 'string',
    example: 'Faisal12',
    description: 'Username of the user',
  })
  @IsNotEmpty({ message: 'Username is required' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/, {
    message: 'Username must contain at least one letter and one number',
  })
  userName: string;

  @ApiProperty({
    name: 'gender',
    type: 'string',
    example: `${Gender.MALE}|${Gender.FEMALE}|${Gender.OTHER}`,
    description: 'Gender of the user. i.e Male, Female, Other',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    name: 'dateOfBirth',
    type: 'string',
    example: '1995-08-12',
    description: 'Date of birth in YYYY-MM-DD format',
  })
  @IsNotEmpty({ message: 'Date of birth is required' })
  @IsDateString(
    {},
    { message: 'Date of birth must be a valid date string (YYYY-MM-DD)' },
  )
  dateOfBirth: string;

  @ApiProperty({
    name: 'email',
    example: 'user@example.com',
    description: 'The email of the user',
    type: 'string',
  })
  @IsEmail(undefined, { message: 'email must be a valid email' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    name: 'phoneNumber',
    type: 'string',
    example: '+1234567890',
    description: 'The phone number of the user',
  })
  @IsString()
  @IsNotEmpty({ message: 'Phone number is required' })
  phoneNumber: string;

  @ApiProperty({
    example: 'Password@12',
    type: 'string',
    description:
      'The password of the user password should be at least 6 and max 50 characters long and contain at least one upper letter, number and a special character',
  })
  @IsString()
  @MinLength(6, { message: 'password should be at least 6 characters long' })
  @MaxLength(50, {
    message: 'password should not be longer than 50 characters',
  })
  @Matches(/((?=.*\d)(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'password too weak, password must contains one upper letter,number and a special character',
  })
  password: string;

  @ApiProperty({
    name: 'city',
    type: 'string',
    example: 'Lahore',
    description: 'The city where the user lives',
  })
  @IsString()
  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @ApiProperty({
    name: 'state',
    type: 'string',
    example: 'Punjab',
    description: 'The state where the user lives',
  })
  @IsString()
  @IsNotEmpty({ message: 'State is required' })
  state: string;

  @ApiProperty({
    name: 'country',
    type: 'string',
    example: 'Pakistan',
    description: 'The country where the user lives',
  })
  @IsString()
  @IsNotEmpty({ message: 'Country is required' })
  country: string;
}
