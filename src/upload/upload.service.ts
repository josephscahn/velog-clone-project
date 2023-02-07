import { Injectable } from '@nestjs/common';
import { deleteImageFile, getImageURL } from 'src/lib/multerOptions';

@Injectable()
export class UploadService {
  thumbnailUpload(files: File[], file_name: string) {
    if (file_name) {
      deleteImageFile(file_name);
    }

    return getImageURL(files);
  }

  thumbnailDelete(file_name: string) {
    deleteImageFile(file_name);
  }
}
