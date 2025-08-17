import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as path from 'path';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.saveFile(file);
  }

  @Get('/:filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    try {
      const file = await this.mediaService.getFileByName(filename);

      // Set headers
      res.setHeader('Content-Type', file.mimeType);
      res.setHeader(
        'Content-Disposition',
        `inline; filename="${path.basename(file.path)}"`,
      );
      res.setHeader('Cache-Control', 'max-age=3600');

      // Create stream and pipe to response
      const fileStream = await this.mediaService.createReadStream(file.path);

      // Handle stream errors
      fileStream.on('error', (error) => {
        console.error(`Error streaming file: ${error.message}`, error.stack);
        if (!res.headersSent) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
            message: 'Error streaming file',
          });
        }
      });

      // Pipe the file to the response
      fileStream.pipe(res);
    } catch (error) {
      if (!res.headersSent) {
        const status =
          error instanceof HttpException
            ? error.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;
        const message =
          error instanceof HttpException
            ? error.message
            : 'Error retrieving file';

        res.status(status).send({ message });
      }
    }
  }
}
