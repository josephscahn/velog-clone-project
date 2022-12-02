import {
  Body,
  Controller,
  UseGuards,
  Post,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CommentsDto } from 'src/dto/comment/comments.dto';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';
import { CommentsParamDto } from 'src/dto/comment/comments.param.dto';

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
    const result = await this.commentService.createComment(
      data,
      post_id,
      user.id,
    );

    return {
      statusCode: 201,
      comments: result,
    };
  }

  @Patch('/:comment_id')
  async updateComment(
    @GetUser() user: User,
    @Param() params: CommentsParamDto,
    @Body() data: CommentsDto,
  ) {
    const result = await this.commentService.updateComment(
      user.id,
      params,
      data,
    );

    return {
      statusCode: 200,
      message: 'comment update success',
      comments: result,
    };
  }

  @Delete('/:post_id/:comment_id')
  async deleteComment(
    @GetUser() user: User,
    @Param() params: CommentsParamDto,
  ) {
    const result = await this.commentService.deleteComment(user.id, params);

    return {
      statusCode: 200,
      message: 'comment delete success',
      comments: result,
    };
  }
}
