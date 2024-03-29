import { Body, Controller, UseGuards, Post, Param, Patch, Delete } from '@nestjs/common';
import { CommentsDto } from 'src/dto/comment/comments.dto';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { CommentsParamDto } from 'src/dto/comment/comments.param.dto';
import { SetResponse } from 'src/common/response';
import { ResponseMessage } from 'src/common/response-message.model';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:id')
  async createCommnet(
    @Body() data: CommentsDto,
    @GetUser() user: User,
    @Param('id') post_id: number,
  ) {
    const result = await this.commentService.createComment(data, post_id, user.id);

    const response = SetResponse('댓글', ResponseMessage.CREATE_SUCCESS);

    return {
      statusCode: response[0],
      message: response[1],
      comments: result.comments,
      comment_count: result.comment_count,
    };
  }

  @Patch('/:post_id/:comment_id')
  async updateComment(
    @GetUser() user: User,
    @Param() params: CommentsParamDto,
    @Body() data: CommentsDto,
  ) {
    const result = await this.commentService.updateComment(user.id, params, data);

    const response = SetResponse('댓글', ResponseMessage.UPDATE_SUCCESS);

    return {
      statusCode: response[0],
      message: response[1],
      comments: result.comments,
      comment_count: result.comment_count,
    };
  }

  @Delete('/:post_id/:comment_id')
  async deleteComment(@GetUser() user: User, @Param() params: CommentsParamDto) {
    const result = await this.commentService.deleteComment(user.id, params);

    const response = SetResponse('댓글', ResponseMessage.DELETE_SUCCESS);

    return {
      statusCode: response[0],
      message: response[1],
      comments: result.comments,
      comment_count: result.comment_count,
    };
  }
}
