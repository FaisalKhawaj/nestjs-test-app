import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
export class ErrorDto {
  @ApiProperty({ default: 'Internal Server Error' })
  message: string;
  @ApiProperty({ enum: HttpStatus, default: HttpStatus.INTERNAL_SERVER_ERROR })
  statusCode: HttpStatus;
}
