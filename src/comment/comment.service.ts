import { Injectable } from '@nestjs/common';
import { CommentsDto } from 'src/dto/comment/comments.dto';
import { CommentsParamDto } from 'src/dto/comment/comments.param.dto';
import { CommentRepository } from 'src/repository/comment.repository';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async selectCommentList(post_id: number, user_id: number) {
    let result = await this.commentRepository.selectCommentList(
      post_id,
      user_id,
    );

    for (let i = 0; i < result.length; i++) {
      if (result[i].nested_comments) {
        const to_json = JSON.parse(result[i].nested_comments);

        result[i].nested_comments = to_json;
      }
    }

    if (result.length == 0) return null;

    return result;
  }

  async createComment(data: CommentsDto, post_id: number, user_id: number) {
    const result = await this.commentRepository.createComment(
      data,
      post_id,
      user_id,
    );

    if (result == 0) return 0;

    const comments = await this.selectCommentList(post_id, user_id);
    return comments;
  }

  async updateComment(
    user_id: number,
    params: CommentsParamDto,
    data: CommentsDto,
  ) {
    const result = await this.commentRepository.updateComment(
      data,
      params.comment_id,
      user_id,
    );

    if (result == 0) return 0;

    const comments = await this.selectCommentList(params.post_id, user_id);

    return comments;
  }

  async deleteComment(user_id: number, params: CommentsParamDto) {
    const result = await this.commentRepository.deleteComment(
      params.comment_id,
      user_id,
    );

    if (result == 0) return 0;

    const comments = await this.selectCommentList(params.post_id, user_id);

    return comments;
  }
}
