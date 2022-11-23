import {
  Body,
  Controller,
  UseGuards,
  Post,
  Param,
  Patch,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { CommentDto } from 'src/dto/comment/comment.dto';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/custom-decorator/get-user.decorator';
import { User } from 'src/entity/user.entity';

@Controller('comments')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/:post_id')
  async createCommnet(
    @Body() data: CommentDto,
    @GetUser() user: User,
    @Param('post_id') post_id: number,
  ) {
    const result = await this.commentService.createComment(
      data,
      post_id,
      user.id,
    );

    if (result == 0) throw new BadRequestException(`comment create failed`);

    return {
      statusCode: 201,
      post: result.post.post,
      next_post: result.post.next_post,
      pre_post: result.post.pre_post,
      comments: result.comments,
    };
  }

  @Patch('/:post_id/:comment_id')
  async updateComment(
    @Body() data: CommentDto,
    @Param('comment_id') comment_id: number,
    @Param('post_id') post_id: number,
    @GetUser() user: User,
  ) {
    const result = await this.commentService.updateComment(
      data,
      comment_id,
      post_id,
      user.id,
    );

    if (result == 0) throw new BadRequestException('comment update failed');

    return {
      statusCode: 200,
      message: 'comment update success',
      result: result,
    };
  }

  @Delete('/:post_id/:comment_id')
  async deleteComment(
    @Param('comment_id') comment_id: number,
    @Param('post_id') post_id: number,
    @GetUser() user: User,
  ) {
    const result = await this.commentService.deleteComment(
      comment_id,
      post_id,
      user.id,
    );

    if (result == 0) throw new BadRequestException('comment delete failed');

    return {
      statusCode: 200,
      message: 'comment delete success',
      result: result,
    };
  }
}
