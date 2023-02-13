import { HttpStatus } from '@nestjs/common';
import { ResponseMessage } from './response-message.model';

export const SetResponse = (name: string, type: ResponseMessage) => {
  if (
    type === ResponseMessage.CREATE_SUCCESS ||
    type === ResponseMessage.FOLLOW_SUCCESS ||
    type === ResponseMessage.POST_LIKE_SUCCESS ||
    type == ResponseMessage.ADD_SUCCESS1
  ) {
    return [HttpStatus.CREATED, name + type];
  }

  return [HttpStatus.OK, name + type];
};
