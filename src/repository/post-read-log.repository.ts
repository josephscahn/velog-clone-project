import { PostReadLog } from 'src/entity/post-read-log.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(PostReadLog)
export class PostReadLogRepository extends Repository<PostReadLog> {
  async getReadLogBypostId(user_id: number, post_id: number) {
    return await this.query(
      `
        SELECT EXISTS (SELECT * FROM post_read_log WHERE user_id = ? AND post_id = ?) AS exist;
      `,
      [user_id, post_id],
    );
  }

  async createReadLog(user_id: number, post_id: number) {
    const readLog = this.create({
      user: user_id,
      post: post_id,
    });

    await this.save(readLog);
  }

  async getReadLog(user_id: number) {
    return await this.query(
      `
      SELECT 
      JSON_ARRAYAGG(
        JSON_OBJECT(
          'post_id', post.id, 
          'post_title', post.title, 
          'post_thumbnail', post.thumbnail, 
          'post_content', post.content, 
          'post_likes', post.likes, 
          'post_comment_count', post.comment_count,
          'post_create_at', DATE_FORMAT(post.create_at, "%Y년 %m월 %d일"),
          'user_id', user.id,
          'user_name', user.name,
          'user_profile_image', user.profile_image
        )
      ) as ReadLog
      FROM post_read_log
      LEFT JOIN post ON post_read_log.post_id = post.id
      LEFT JOIN user ON post.user_id = user.id
      WHERE post_read_log.user_id = ?
      ORDER BY post_read_log.create_at DESC;
      `,
      [user_id],
    );
  }

  async deleteReadList(user_id: number, post_id: number) {
    await this.createQueryBuilder()
      .delete()
      .from(PostReadLog)
      .where(`user_id = :user_id AND post_id = :post_id`, { user_id, post_id })
      .execute();
  }
}
