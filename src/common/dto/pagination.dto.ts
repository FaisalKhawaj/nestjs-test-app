import { IsInt, IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class PaginationDto {
  @ApiProperty({
    description: 'The page number to retrieve',
    default: 1,
    type: 'number',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => (isNaN(value) ? value : Number(value)))
  page?: number = 1;

  @ApiProperty({
    description: 'The number of items to retrieve per page',
    default: 10,
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Transform(({ value }) => (isNaN(value) ? value : Number(value)))
  limit?: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
