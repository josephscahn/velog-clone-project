import { Controller, UseInterceptors, UploadedFiles, Post, Query, Delete } from '@nestjs/common';
import { UploadService } from './upload.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/lib/multerOptions';
import { SetResponse } from 'src/common/response';
import { ResponseMessage } from 'src/common/response-message.model';

@Controller('uploads')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @UseInterceptors(FilesInterceptor('image', 1, multerOptions))
  @Post('')
  thumbnailUpload(@UploadedFiles() files: File[], @Query('image_url') image_url: string) {
    const result = this.uploadService.thumbnailUpload(files, image_url);

    const response = SetResponse('썸네일', ResponseMessage.ADD_SUCCESS2);

    return {
      statusCode: response[0],
      message: response[1],
      imageUrl: result[0],
    };
  }

  @Delete('')
  thumbnailDelete(@Query('image_url') image_url: string) {
    this.uploadService.thumbnailDelete(image_url);

    const response = SetResponse('썸네일', ResponseMessage.DELETE_SUCCESS);

    return {
      statusCode: response[0],
      message: response[1],
    };
  }
}
