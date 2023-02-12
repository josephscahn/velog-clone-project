import { Injectable } from '@nestjs/common';
import { deleteImageFile, getImageURL, getUploadPath } from 'src/lib/multerOptions';
import { createWriteStream } from 'fs';
import { HttpService } from '@nestjs/axios';
import uuidRandom from 'src/lib/uuidRandom';

@Injectable()
export class UploadService {
  constructor(private readonly http: HttpService) {}

  thumbnailUpload(files: File[], file_name: string) {
    if (file_name) {
      deleteImageFile(file_name);
    }

    return getImageURL(files);
  }

  thumbnailDelete(file_name: string) {
    deleteImageFile(file_name);
  }

  async linkedProfileImageUpload(image_url: string) {
    const uploadPath: string = getUploadPath();
    const imageUrl = uuidRandom(image_url);
    const writer = createWriteStream(`${uploadPath}/${imageUrl}`);
    const response = await this.http.axiosRef({
      method: 'GET',
      url: image_url,
      responseType: 'stream',
    });
    response.data.pipe(writer);
    new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
    return imageUrl;
  }
}
