import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export const ApiErrorDecorator = (status: number, message: string) => {
  return applyDecorators(
    ApiResponse({
      status,
      description: message,
      schema: {
        type: 'object',
        properties: {
          statusCode: {
            type: 'number',
            example: status,
          },
          message: {
            type: 'string',
            example: message,
          },
          error: {
            type: 'string',
            example: message,
          },
        },
      },
    }),
  );
};
