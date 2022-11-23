import { CommentDto } from 'src/dto/comment/comment.dto';
import { Comment } from 'src/entity/comment.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async createComment(data: CommentDto, post_id: number, user_id: number) {
    const comment = this.create({
      user: user_id,
      post: post_id,
      content: data.content,
      depth: data.depth,
      comment: data.parent_id,
    });

    try {
      await this.save(comment);
      return 1;
    } catch (err) {
      return 0;
    }
  }

  async updateComment(data: CommentDto, comment_id: number, user_id: number) {
    const comment = this.createQueryBuilder()
      .update(Comment)
      .set({
        content: data.content,
      })
      .where(`id = :comment_id AND user_id = :user_id`, {
        comment_id: comment_id,
        user_id: user_id,
      });

    try {
      await comment.execute();
      return 1;
    } catch (err) {
      return 0;
    }
  }

  async deleteComment(comment_id: number, user_id: number) {
    const comment = this.createQueryBuilder()
      .delete()
      .from(Comment)
      .where(`id = :comment_id AND user_id = :user_id`, {
        comment_id: comment_id,
        user_id: user_id,
      });

    try {
      await comment.execute();
      return 1;
    } catch (err) {
      return 0;
    }
  }

  async selectCommentList(post_id: number, user_id: number) {
    const comment = await this.query(
      `WITH nested_comments AS (
        SELECT 
        comments.id AS comment_id,
        JSON_ARRAYAGG(
           JSON_OBJECT(
           'nested_comment_user_id', user.id,
           'nested_comment_login_id', user.login_id,
           'nested_comment_profile_image', user.profile_image,
          'nested_comment_id', nc.id,
           'nested_comment_content', nc.content,
           'nested_comment_depth', nc.depth,
           'nested_comment_create_at', nc.create_at,
           'nested_comment_update_at', nc.update_at,
           'nested_comments_is_writer', IF(user.id = ?, 'true', 'false')
           )
        ) as nested_comments
        FROM comments
        INNER JOIN comments nc ON nc.paren_id = comments.id AND nc.depth = 1
        LEFT JOIN user ON user.id = nc.user_id
      )
      
      SELECT 
      post.id AS post_id,
      user.id AS user_id,
      user.login_id AS comment_login_id,
      user.profile_image AS comment_profile_image,
      comments.id AS comment_id,
      comments.content,
      comments.depth,
      comments.create_at,
      comments.update_at,
      nc.nested_comments,
      IF(user.id = ?, 1, 0) AS comments_is_writer
      FROM comments
      LEFT JOIN post ON post.id = comments.post_id
      LEFT JOIN user ON user.id = comments.user_id
      LEFT JOIN nested_comments nc ON nc.comment_id = comments.id
      WHERE post.id = ?`,
      [user_id, user_id, post_id],
    );

    if (comment.length <= 0) return 0;

    return comment;
  }
}
