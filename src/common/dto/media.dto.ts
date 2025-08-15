import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateMediaDto {
  @ApiProperty({
    description: 'Name of the file',
    example: 'profile_picture.jpg',
  })
  @IsString()
  fileName: string;

  @ApiProperty({
    description: 'Type of the file',
    example: 'image/jpeg',
  })
  @IsString()
  fileType: string;

  @ApiProperty({
    description: 'Size of the file in bytes',
    example: 1024,
  })
  @IsNumber()
  fileSize: number;

  @ApiProperty({
    description: 'URL where the file is stored',
    example: 'https://example.com/uploads/profile_picture.jpg',
  })
  @IsString()
  url: string;

  @ApiProperty({
    description: 'Indicates if this is a verification image',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isVerificationImage?: boolean = false;

  @ApiProperty({
    description: 'Indicates if this is a passport image',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isPassportImage?: boolean = false;
}
export class UpdateMediaDto extends PartialType(CreateMediaDto) {}
