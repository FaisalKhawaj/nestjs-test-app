import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class SortingDto {
  @ApiProperty({
    description: 'Field to sort by',
    required: false,
    example: 'createdAt',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({
    description: 'Sort order (ASC or DESC)',
    required: false,
    enum: SortOrder,
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  @Transform(({ value }) =>
    value?.toUpperCase() === SortOrder.ASC ? SortOrder.ASC : SortOrder.DESC,
  )
  sortOrder?: SortOrder = SortOrder.DESC;
}
