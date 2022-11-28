require('dotenv').config();

import { existsSync, fstat, mkdirSync, unlinkSync } from 'fs';
import { diskStorage } from 'multer';
import uuidRandom from './uuidRandom';

export const multerOptions = {
  fileFilter: (request, file, callback) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      // 이미지 형식은 jpg, jpeg, png만 허용합니다.
      callback(null, true);
    } else {
      console.log('지원하지 않는 이미지 형식 ㅇㅇ');
    }
  },

  storage: diskStorage({
    destination: (request, file, callback) => {
      const uploadPath: string = 'public';

      if (!existsSync(uploadPath)) {
        // public 폴더가 존재하지 않을시, 생성합니다.
        mkdirSync(uploadPath);
      }

      callback(null, uploadPath);
    },

    filename: (request, file, callback) => {
      callback(null, uuidRandom(file));
    },
  }),
};

const createImageURL = (file): string => {
  const serverAddress: string = 'http://localhost:' + process.env.SERVER_POST;

  return `${serverAddress}/public/${file.filename}`;
};

export const getImageURL = (files: File[]) => {
  const generatedFiles: string[] = [];

  for (const file of files) {
    generatedFiles.push(createImageURL(file));
  }

  return generatedFiles;
};

export const deleteImageFile = (file_name) => {
  if (existsSync('./public/' + file_name)) {
    unlinkSync('./public/' + file_name);
  }
};
