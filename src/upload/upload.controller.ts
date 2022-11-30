import {
  Controller,
  UseInterceptors,
  UploadedFiles,
  Post,
  Query,
  Delete,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/lib/multerOptions';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseInterceptors(FilesInterceptor('image', 1, multerOptions))
  @Post('/thumbnail')
  thumbnailUpload(
    @UploadedFiles() files: File[],
    @Query('image_url') image_url: string,
  ) {
    const result = this.uploadService.thumbnailUpload(files, image_url);

    return {
      statusCode: 200,
      imageUrl: result,
    };
  }

  @Delete('/thumbnail')
  thumbnailDelete(@Query('image_url') image_url: string) {
    this.thumbnailDelete(image_url);

    return {
      statusCode: 200,
      message: 'thumbnail delete success',
    };
  }
}
