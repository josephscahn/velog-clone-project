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
    return await this.createQueryBuilder('post_read_log')
      .leftJoin('post', 'post', 'post_read_log.post_id = post.id')
      .leftJoin('comments', 'comments', 'comments.post_id = post.id')
      .leftJoin('user', 'user', 'post.user = user.id')
      .select([
        'post.id AS post_id',
        'post.title',
        'IF(post.thumbnail=null, null, CONCAT(:server_url, post.thumbnail)) as post_thumbnail',
        'post.likes',
        'COUNT(comments.id) AS post_comment_count',
        'post.create_at AS create_at',
        'user.id AS user_id',
        'user.name',
        'IF(user.profile_image=null, null, CONCAT(:server_url, user.profile_image)) as user_profile_image',
      ])
      .setParameter('server_url', process.env.IMAGE_URL)
      .where('post_read_log.user_id = :user_id', { user_id })
      .groupBy('post.id')
      .getRawMany();
  }

  async deleteReadList(user_id: number, post_id: number) {
    await this.createQueryBuilder()
      .delete()
      .from(PostReadLog)
      .where(`user_id = :user_id AND post_id = :post_id`, { user_id, post_id })
      .execute();
  }
}
