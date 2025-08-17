import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import * as fsSync from 'fs';
import * as path from 'path';

@Injectable()
export class MediaService {
  private readonly uploadDir: string;
  private readonly logger = new Logger(MediaService.name);
  constructor(private readonly configService: ConfigService) {
    const dir = this.configService.get('MULTER_DEST');
    if (!dir) {
      throw new Error('Upload directory not found in configuration');
    }

    this.uploadDir = dir;
  }

  async saveFile(file: Express.Multer.File) {
    const fileName = file.filename;
    // const filePath = join(this.uploadDir, fileName);
    return {
      originalname: file.originalname,
      filename: fileName,
      size: file.size,
    };
  }

  async getFileByName(filename: string) {
    this.logger.debug(`Searching for file with name: ${filename}`);

    try {
      // Make sure filename is valid and doesn't contain path traversal attempts
      if (
        !filename ||
        filename.includes('..') ||
        filename.includes('/') ||
        filename.includes('\\')
      ) {
        throw new HttpException('Invalid filename', HttpStatus.BAD_REQUEST);
      }

      const absoluteUploadDir = path.resolve(process.cwd(), this.uploadDir);

      const files = await fs.readdir(absoluteUploadDir);

      let matchingFile = files.find((file) => file === filename);

      if (!matchingFile) {
        const searchBase = filename.includes('.')
          ? filename.split('.')[0]
          : filename;

        matchingFile = files.find((file) => file.startsWith(searchBase));
      }

      if (!matchingFile) {
        this.logger.warn(`No file found matching: ${filename}`);
        throw new HttpException('File not found', HttpStatus.NOT_FOUND);
      }

      const filePath = path.join(absoluteUploadDir, matchingFile);

      // Verify file is readable
      try {
        await fs.access(filePath, fsSync.constants.R_OK);
      } catch (error) {
        this.logger.error(
          `File exists but is not readable: ${filePath}`,
          error.stack,
        );
        throw new HttpException(
          'File exists but is not readable',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return {
        filename: matchingFile,
        path: filePath,
        mimeType: this.getMimeType(filePath),
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Error retrieving file: ${error.message}`, error.stack);
      throw new HttpException(
        'Error retrieving file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private getMimeType(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpg',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.pdf': 'application/pdf',
      '.txt': 'text/plain',
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.xml': 'application/xml',
      '.mp3': 'audio/mpeg',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }

  async createReadStream(filePath: string) {
    try {
      // Make sure the file exists before attempting to create a stream
      await fs.access(filePath);
      return fsSync.createReadStream(filePath);
    } catch (error) {
      throw new HttpException(
        `Error creating file stream: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
