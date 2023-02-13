import { Controller, Get, Param, Patch, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { ListsService } from './lists.service';
import { SetResponse } from 'src/common/response';
import { ResponseMessage } from 'src/common/response-message.model';

@Controller('lists')
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get('/read')
  @UsePipes(ValidationPipe)
  @UseGuards(JwtAuthGuard)
  async getReadList(@GetUser() user: User) {
    const posts = await this.listsService.getReadLog(user.id);

    const response = SetResponse('최근 읽은 게시글', ResponseMessage.READ_SUCCESS);

    return {
      statusCode: response[0],
      message: response[1],
      posts,
    };
  }

  @Patch('/read/:post_id')
  @UseGuards(JwtAuthGuard)
  async deleteReadList(@GetUser() user: User, @Param('post_id') post_id: number) {
    const posts = await this.listsService.deleteReadList(user.id, post_id);

    const response = SetResponse(
      '최근 읽은 ' + String(post_id) + '번 게시글',
      ResponseMessage.DELETE_SUCCESS,
    );

    return {
      statusCode: response[0],
      message: response[1],
      posts,
    };
  }

  @Get('/like')
  @UseGuards(JwtAuthGuard)
  async getLikedList(@GetUser() user: User) {
    const posts = await this.listsService.getLikedList(user.id);

    const response = SetResponse('좋아요한 게시글', ResponseMessage.READ_SUCCESS);

    return {
      statusCode: response[0],
      message: response[1],
      posts,
    };
  }
}
