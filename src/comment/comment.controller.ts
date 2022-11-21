import {
  Body,
  Controller,
  UseGuards,
  Post,
  Param,
  Patch,
  Delete,
  BadRequestException,
  Get,
  NotFoundException,
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
      message: 'comment create success',
    };
  }

  @Patch('/:comment_id')
  async updateComment(
    @Body() data: CommentDto,
    @Param('comment_id') comment_id: number,
    @GetUser() user: User,
  ) {
    const result = await this.commentService.updateComment(
      data,
      comment_id,
      user.id,
    );

    if (result == 0) throw new BadRequestException('comment update failed');

    return {
      statusCode: 200,
      message: 'comment update success',
      result: result,
    };
  }

  @Delete('/:comment_id')
  async deleteComment(
    @Param('comment_id') comment_id: number,
    @GetUser() user: User,
  ) {
    const result = await this.commentService.deleteComment(comment_id, user.id);

    if (result == 0) throw new BadRequestException('comment delete failed');

    return {
      statusCode: 200,
      message: 'comment delete success',
      result: result,
    };
  }

  @Get('/:post_id')
  async selectCommentList(
    @Param('post_id') post_id: number,
    @GetUser() user: User,
  ) {
    const result = await this.commentService.selectCommentList(
      post_id,
      user.id,
    );

    if (result == 0) throw new NotFoundException(`댓글이 존재하지 않습니다.`);

    return {
      statusCode: 200,
      result: result,
    };
  }
}
