import { Injectable } from '@nestjs/common';
import { deleteImageFile, getImageURL } from 'src/lib/multerOptions';

@Injectable()
export class UploadService {
  thumbnailUpload(files: File[], image_url: string) {
    if (image_url) {
      const file_name = image_url.replace('http://localhost:8000/public/', '');
      deleteImageFile(file_name);
    }

    return getImageURL(files);
  }

  thumbnailDelete(image_url: string) {
    const file_name = image_url.replace('http://localhost:8000/public/', '');
    deleteImageFile(file_name);
  }
}
