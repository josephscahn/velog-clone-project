import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export default (file): string => {
  let uuidPath: string;
  if (typeof file === 'string') {
    uuidPath = `${uuid()}${extname(file.split('?')[0]) || '.png'}`;
  } else {
    uuidPath = `${uuid()}${extname(file.originalname)}`;
  }
  return uuidPath;
};
