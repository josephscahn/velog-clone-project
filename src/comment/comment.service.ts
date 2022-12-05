import { Injectable } from '@nestjs/common';
import { CommentsDto } from 'src/dto/comment/comments.dto';
import { CommentsParamDto } from 'src/dto/comment/comments.param.dto';
import { CommentRepository } from 'src/repository/comment.repository';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async selectCommentList(post_id: number, login_user_id: number) {
    let result = await this.commentRepository.selectCommentList(
      post_id,
      login_user_id,
    );

    for (let i = 0; i < result.length; i++) {
      result[i].is_comments_writer = Number.parseInt(
        result[i].is_comments_writer,
      );
      if (result[i].nested_comments) {
        const to_json = JSON.parse(result[i].nested_comments);

        result[i].nested_comments = to_json;
      }
    }

    if (result.length == 0) return null;

    return result;
  }

  async createComment(data: CommentsDto, post_id: number, user_id: number) {
    await this.commentRepository.createComment(data, post_id, user_id);

    const comments = await this.selectCommentList(post_id, user_id);
    return comments;
  }

  async updateComment(
    user_id: number,
    params: CommentsParamDto,
    data: CommentsDto,
  ) {
    await this.commentRepository.updateComment(
      data,
      params.comment_id,
      user_id,
    );

    const comments = await this.selectCommentList(params.post_id, user_id);

    return comments;
  }

  async deleteComment(user_id: number, params: CommentsParamDto) {
    await this.commentRepository.deleteComment(params.comment_id, user_id);

    const comments = await this.selectCommentList(params.post_id, user_id);

    return comments;
  }
}
