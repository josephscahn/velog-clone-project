import { Injectable } from '@nestjs/common';
import { CommentsDto } from 'src/dto/comment/comments.dto';
import { CommentsParamDto } from 'src/dto/comment/comments.param.dto';
import { CommentRepository } from 'src/repository/comment.repository';

@Injectable()
export class CommentService {
  constructor(private commentRepository: CommentRepository) {}

  async selectCommentList(post_id: number, login_user_id: number) {
    let comments = await this.commentRepository.selectCommentList(post_id, login_user_id);

    for (let i = 0; i < comments.length; i++) {
      comments[i].is_comments_writer = Number.parseInt(comments[i].is_comments_writer);
      if (comments[i].nested_comments) {
        const to_json = JSON.parse(comments[i].nested_comments);

        comments[i].nested_comments = to_json;
      }
    }

    if (comments.length == 0) {
      return { comments: null, comment_count: 0 };
    }

    const comment_count = await this.commentRepository.getCommentCount(post_id);

    return { comments, comment_count: comment_count[0].comment_count };
  }

  async createComment(data: CommentsDto, post_id: number, user_id: number) {
    let { content, parent_id } = data;
    if (parent_id === 0 || !parent_id) parent_id = null;
    await this.commentRepository.createComment(content, parent_id, post_id, user_id);
    const comments = await this.selectCommentList(post_id, user_id);
    return comments;
  }

  async updateComment(user_id: number, params: CommentsParamDto, data: CommentsDto) {
    await this.commentRepository.updateComment(data, params.comment_id, user_id);

    const comments = await this.selectCommentList(params.post_id, user_id);

    return comments;
  }

  async deleteComment(user_id: number, params: CommentsParamDto) {
    await this.commentRepository.deleteComment(params.comment_id, user_id);

    const comments = await this.selectCommentList(params.post_id, user_id);

    return comments;
  }
}
