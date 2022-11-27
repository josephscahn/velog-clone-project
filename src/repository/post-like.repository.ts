import { PostLike } from 'src/entity/post-like.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PostLike)
export class PostLikeRepository extends Repository<PostLike> {
  async likePost(user_id: number, post_id: number) {
    const likePost = this.create({ user: user_id, post: post_id });
    await this.save(likePost);
  }

  async unlikePost(user_id: number, post_id: number) {
    await this.createQueryBuilder()
      .delete()
      .where(`user = :user_id AND post_id = :post_id`, { user_id, post_id })
      .execute();
  }

  async getLikedPostOne(user_id: number, post_id: number) {
    return await this.findOne({ user: user_id, post: post_id });
  }

  async getLikedList(user_id: number) {
    return await this.query(
      `
        SELECT
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'post_id', post.id,
              'title', post.title,
              'thumbnail', post.thumbnail,
              'content', post.content,
              'create_at', DATE_FORMAT(post.create_at, "%Y년 %m월 %d일"),
              'post_likes', post.likes, 
              'post_comment_count', post.comment_count,
              'user_id', user.id,
              'user_name', user.name,
              'user_profile_image', user.profile_image
            )
          ) AS LIKED_POST
        FROM post_like
        LEFT JOIN post ON post_like.post_id = post.id
        LEFT JOIN user ON post_like.user_id = user.id
        WHERE post_like.user_id = ?;
      `,
      [user_id],
    );
  }
}
