import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayNotEmpty,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { ContentTypes } from 'src/common/enums/enums';

export class CreatePostDto {
  @ApiProperty({
    description: 'ID of the user creating the post',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID('all')
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Type of content in the post',
    enum: ContentTypes,
    example: `${ContentTypes.TEXT}|${ContentTypes.IMAGE}|${ContentTypes.VIDEO}|${ContentTypes.AUDIO}`,
  })
  @IsEnum(ContentTypes, { each: true })
  @IsNotEmpty()
  contentType: ContentTypes;

  @ApiProperty({
    description: 'Array of content (text, image URLs, or video URLs)',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
    ],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  content: string[];

  @ApiProperty({
    description: 'Optional caption for the post',
    example: 'Check out this amazing view!',
    required: false,
  })
  @IsString()
  @IsOptional()
  caption?: string;
}
